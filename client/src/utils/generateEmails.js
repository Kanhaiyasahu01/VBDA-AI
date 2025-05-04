import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import pLimit from 'p-limit';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

const sanitize = (val) => (!val || val.trim().toLowerCase() === 'n/a' ? '' : val.trim());

export const generateEmails = async (rows) => {
  const limit = pLimit(5);

  const tasks = rows.map((row) =>
    limit(async () => {
      const { firstName, email, organization, role, achievement } = row;

      const prompt = `
      Generate a brief, warm, and professional email inviting this person to VBDA 2025. Include their name, role, organization, and achievements if available.
      
      - Name: ${sanitize(firstName)}
      - Organization: ${sanitize(organization) || 'Independent'}
      - Role: ${sanitize(role) || 'Participant'}
      - Achievements: ${sanitize(achievement) || 'No notable achievements listed'}
      
      The email should start with "Dear [Name]," and be personalized in a professional, respectful tone. Keep the content clear and concise—no need for long paragraphs.
      
      For the closing, use the following format:
      Sincerely,
      VBDA 2025
      Invitation for VBDA
      VBDA Organization
      `.trim();
      

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        return {
          ...row,
          aiGeneratedContent: text?.trim() || 'No content generated',
          emailSubject: "You're Invited to VBDA 2025",
        };
      } catch (err) {
        console.error('Gemini Error:', err);
        return {
          ...row,
          aiGeneratedContent: '⚠️ Failed to generate content.',
          emailSubject: "You're Invited to VBDA 2025",
        };
      }
    })
  );

  return await Promise.all(tasks);
};
