// emailsend.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends bulk emails to recipients using SendGrid
 * @param {Array} recipients - Array of recipient objects with email and content
 * @returns {Promise<boolean>} Success status
 */
const sendBulkEmails = async (recipients) => {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    console.error('Invalid or empty recipients array');
    return false;
  }

  console.log(`Preparing to send ${recipients.length} emails...`);

  const validRecipients = recipients.filter(person => 
    person && person.email && person.aiGeneratedContent
  );

  if (validRecipients.length === 0) {
    console.error('No valid recipients to send emails to');
    return false;
  }

  if (validRecipients.length !== recipients.length) {
    console.warn(`Filtered out ${recipients.length - validRecipients.length} invalid recipients`);
  }

  const emails = validRecipients.map((person) => {
    const content = person.aiGeneratedContent.trim();
    const htmlContent = content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');

    return {
      to: person.email,
      from: {
        name: "VBDA Kanhaiya",
        email: process.env.FROM_EMAIL || 'noreply@vbda2025.org',
      },
      subject: person.subject || "You're Invited to VBDA 2025",
      text: content,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <p>${htmlContent}</p>
      </div>`,
    };
  });

  try {
    if (emails.length > 50) {
      console.log('Sending emails in parallel batches...');

      const batchSize = 50;
      const batchPromises = [];

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const promise = sgMail.send(batch, true)
          .then(() => console.log(`Batch ${Math.floor(i / batchSize) + 1} sent: ${batch.length} emails`))
          .catch(err => {
            console.error(`Error in batch ${Math.floor(i / batchSize) + 1}:`, err.message);
            if (err.response) console.error('SendGrid error details:', err.response.body);
          });
        batchPromises.push(promise);
      }

      await Promise.all(batchPromises);

    } else {
      await sgMail.send(emails, true);
    }

    console.log(`✅ Successfully processed ${emails.length} emails`);
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return false;
  }
};

module.exports = { sendBulkEmails };