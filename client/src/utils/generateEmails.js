// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
// import pLimit from 'p-limit';

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: 'gemini-1.5-flash',
//   safetySettings: [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//   ],
// });

// const sanitize = (val) => (!val || val.trim().toLowerCase() === 'n/a' ? '' : val.trim());

// export const generateEmails = async (rows,emailTemplate) => {
//   const limit = pLimit(5);

//   const tasks = rows.map((row) =>
//     limit(async () => {
//       const { firstName, email, organization, role, achievement } = row;

//       const prompt = `
//       Generate a brief, warm, and professional email inviting this person to VBDA 2025. Include their name, role, organization, and achievements if available.
      
//       - Name: ${sanitize(firstName)}
//       - Organization: ${sanitize(organization) || 'Independent'}
//       - Role: ${sanitize(role) || 'Participant'}
//       - Achievements: ${sanitize(achievement) || 'No notable achievements listed'}
      
//       The email should start with "Dear [Name]," and be personalized in a professional, respectful tone. Keep the content clear and concise—no need for long paragraphs.
      
//       For the closing, use the following format:
//       Sincerely,
//       VBDA 2025
//       Invitation for VBDA
//       VBDA Organization
//       `.trim();
      

//       try {
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = await response.text();

//         return {
//           ...row,
//           aiGeneratedContent: text?.trim() || 'No content generated',
//           emailSubject: "You're Invited to VBDA 2025",
//         };
//       } catch (err) {
//         console.error('Gemini Error:', err);
//         return {
//           ...row,
//           aiGeneratedContent: '⚠️ Failed to generate content.',
//           emailSubject: "You're Invited to VBDA 2025",
//         };
//       }
//     })
//   );

//   return await Promise.all(tasks);
// };


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

const sanitize = (val) =>
  !val || val.trim().toLowerCase() === 'n/a' ? '' : val.trim();

// Define prompt variants for each type
const promptMap = {
  'initial': `You are writing an initial invitation to attend VBDA 2025.`,
  'followup': `You are writing a polite follow-up email regarding an earlier invitation to VBDA 2025.`,
  'reminder': `You are writing a final reminder email about the VBDA 2025 invitation.`,
};

export const generateEmails = async (rows, emailTemplate) => {
  const limit = pLimit(5);
  console.log("template",emailTemplate)
  const promptType = promptMap[emailTemplate.type] || promptMap['initial-invitation'];

  const tasks = rows.map((row) =>
    limit(async () => {
      const { firstName, organization, role, achievement } = row;

      const prompt = `
${promptType}

Here is a reference email template for tone and structure:
"""
${emailTemplate.body.trim()}
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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        return {
          ...row,
          aiGeneratedContent: text?.trim() || 'No content generated',
          emailSubject: emailTemplate.subject || "You're Invited to VBDA 2025",
        };
      } catch (err) {
        console.error('Gemini Error:', err);
        return {
          ...row,
          aiGeneratedContent: '⚠️ Failed to generate content.',
          emailSubject: emailTemplate.subject || "You're Invited to VBDA 2025",
        };
      }
    })
  );

  return await Promise.all(tasks);
};
