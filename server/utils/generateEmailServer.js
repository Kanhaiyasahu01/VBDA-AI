// generatemail.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the Google AI with the API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

const sanitize = (val) =>
  !val || val.trim().toLowerCase() === 'n/a' ? '' : val.trim();

// Define prompt variants for each type
const promptMap = {
  'initial': `You are writing an initial invitation to attend VBDA 2025.`,
  'followup': `You are writing a polite follow-up email regarding an earlier invitation to VBDA 2025.`,
  'reminder': `You are writing a final reminder email about the VBDA 2025 invitation.`,
};

/**
 * Generates personalized emails for each recipient using AI
 * @param {Array} rows - Array of invitation objects with recipient data
 * @param {Object} emailTemplate - Email template object with type and body fields
 * @returns {Promise<Array>} Array of objects with email content
 */
const generateEmails = async (rows, emailTemplate) => {
  console.log("Inside generate emails function");
  console.log("Template type:", emailTemplate?.type);

  const template = emailTemplate?.toObject ? emailTemplate.toObject() : emailTemplate;
  const promptType = promptMap[template?.type] || promptMap['initial'];

  console.log("Preparing the prompts for", rows.length, "recipients");

  const results = await Promise.allSettled(
    rows.map(async (row) => {
      const invitation = row?.toObject ? row.toObject() : row;
      const email = invitation.email || '';
      const firstName = invitation.firstName || invitation.name || 'Guest';
      const organization = invitation.organization || 'Independent';
      const role = invitation.role || invitation.position || 'Participant';
      const achievement = invitation.achievement || '';

      const responseLink = `http://localhost:5173/respond?email=${encodeURIComponent(email)}`;

      console.log(`Processing email for: ${email}`);

      const prompt = `
      ${promptType}
      
      You are generating a personalized email in HTML format.
      
      Here is a reference email template for tone, structure, and format:
      """
      ${emailTemplate.body.trim()}
      """
      
      Generate a similar email using the following information:
      - Name: ${sanitize(firstName) || "Guest"}
      - Organization: ${sanitize(organization) || "Independent"}
      - Role: ${sanitize(role) || "Participant"}
      - Achievements: ${
        sanitize(achievement) || "No notable achievements listed"
      }
      
     Instructions:
      - Strictly follow the tone, structure, and formatting of the reference email.
      - Use only HTML tags like <p>, <strong>, <a>, <br/>, etc. Do NOT include <html>, <head>, or <body> tags.
      - Embed this RSVP/Unsubscribe link as a clickable anchor tag:  
        <a href="${responseLink}">${responseLink}</a>
      - Keep the total content under 200 words.
      - Return ONLY the inner HTML content (no outer HTML document structure).
      
      Return only the HTML-formatted email.
      `.trim();

      try {
        console.log(`Generating content for ${email}`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log(`Content generated for ${email}`);

        return {
          email,
          aiGeneratedContent: text?.trim() || 'No content generated',
          subject: template?.subject || "You're Invited to VBDA 2025",
        };
      } catch (err) {
        console.error(`Gemini Error for ${email}:`, err.message);
        return {
          email,
          aiGeneratedContent: '⚠️ Failed to generate content.',
          subject: template?.subject || "You're Invited to VBDA 2025",
        };
      }
    })
  );

  // Filter out any failed results
  const finalResults = results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
  
  console.log("All email generation tasks completed");
  return finalResults;
};

// Export the function as a module for use in other parts of your backend
module.exports = { generateEmails };
