const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendBulkEmail = async (req, res) => {
  const { recipients } = req.body;
    console.log(recipients);
  if (!Array.isArray(recipients)) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  try {
    const emails = recipients.map((person) => {
      if (!person.email || !person.aiGeneratedContent) {
        throw new Error('Missing email or content');
      }

      return {
        to: person.email,
        from: {
          name: "VBDA Kanhaiya",
          email: process.env.FROM_EMAIL,
        },
        subject: person.subject || "You're Invited to VBDA 2025",
        text: person.aiGeneratedContent,
        html: `<p>${person.aiGeneratedContent}</p>`,
      };
    });

    await sgMail.send(emails, true);

    return res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error);
    return res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
};
