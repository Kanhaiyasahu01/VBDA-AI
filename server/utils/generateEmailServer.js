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

  // Convert emailTemplate to plain object if it's a MongoDB document
  const template = emailTemplate?.toObject ? emailTemplate.toObject() : emailTemplate;
  
  const promptType = promptMap[template?.type] || promptMap['initial'];

  console.log("Preparing the prompts for", rows.length, "recipients");

  const results = [];
  
  // Process each row sequentially
  for (const row of rows) {
    // Convert MongoDB document to plain JavaScript object if needed
    const invitation = row?.toObject ? row.toObject() : row;
    
    // Extract required fields with fallbacks
    const email = invitation.email || '';
    const firstName = invitation.firstName || invitation.name || 'Guest';
    const organization = invitation.organization || 'Independent';
    const role = invitation.role || invitation.position || 'Participant';
    const achievement = invitation.achievement || '';

    console.log(`Processing email for: ${email}`);

    const prompt = `
${promptType}

Here is a reference email template for tone and structure:
"""
${template?.body?.trim() || ''}
"""

Please generate a similar email using the following information:
- Name: ${sanitize(firstName) || 'Guest'}
- Organization: ${sanitize(organization) || 'Independent'}
- Role: ${sanitize(role) || 'Participant'}
- Achievements: ${sanitize(achievement) || 'No notable achievements listed'}

Make sure the email starts with "Dear [Name]," and ends with:
Sincerely,  
VBDA 2025  
Invitation for VBDA  
VBDA Organization

Keep the message respectful, brief, and professional. Do not exceed 200 words.
    `.trim();

    try {
      console.log(`Generating content for ${email}`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      console.log(`Content generated for ${email}`);

      results.push({
        email,
        aiGeneratedContent: text?.trim() || 'No content generated',
        subject: template?.subject || "You're Invited to VBDA 2025",
      });
    } catch (err) {
      console.error(`Gemini Error for ${email}:`, err.message);
      results.push({
        email,
        aiGeneratedContent: '⚠️ Failed to generate content.',
        subject: template?.subject || "You're Invited to VBDA 2025",
      });
    }
  }

  console.log("All email generation tasks completed");
  return results;
};

// Export the function as a module for use in other parts of your backend
module.exports = { generateEmails };
