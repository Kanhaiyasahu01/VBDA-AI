// Outside of the Upload component
import axios from 'axios';

export const handleSendEmails = async (jsonData, setUploadMessage, setError, setLoading) => {
    setLoading(true);
    try {
        console.log("inside send email")
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/send-emails`, {
        recipients: jsonData.map((row) => ({
          email: row.email,
          aiGeneratedContent: row.aiGeneratedContent,
          subject: row.emailSubject, // Customize as needed
          mail_settings: {
    sandbox_mode: {
      enable: true,
    },
  },
        })),
      });
  
      console.log(response);
      if (response.data.success) {
        setUploadMessage('✅ Emails sent successfully.');
      } else {
        setError('❌ Failed to send emails.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Server error while sending emails.');
    } finally {
      setLoading(false);
    }
  };
  