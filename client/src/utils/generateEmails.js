import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import pLimit from "p-limit";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

const sanitize = (val) =>
  !val || val.trim().toLowerCase() === "n/a" ? "" : val.trim();

// Define prompt variants for each type
const promptMap = {
  initial: `You are writing an initial invitation to attend VBDA 2025.`,
  followup: `You are writing a polite follow-up email regarding an earlier invitation to VBDA 2025.`,
  reminder: `You are writing a final reminder email about the VBDA 2025 invitation.`,
};

export const generateEmails = async (rows, emailTemplate) => {
  const limit = pLimit(5);
  console.log("template", emailTemplate);
  const promptType = promptMap[emailTemplate.type] || promptMap["initial"];

  const tasks = rows.map((row) =>
    limit(async () => {
      const { firstName, email, organization, role, achievement } = row;

      // Generate the Gmail unsubscribe or RSVP link
      const responseLink = `http://localhost:5173/respond?email=${encodeURIComponent(
        email
      )}`;

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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        return {
          ...row,
          aiGeneratedContent: text?.trim() || "No content generated",
          emailSubject: emailTemplate.subject || "You're Invited to VBDA 2025",
        };
      } catch (err) {
        console.error("Gemini Error:", err);
        return {
          ...row,
          aiGeneratedContent: "⚠️ Failed to generate content.",
          emailSubject: emailTemplate.subject || "You're Invited to VBDA 2025",
        };
      }
    })
  );

  return await Promise.all(tasks);
};
