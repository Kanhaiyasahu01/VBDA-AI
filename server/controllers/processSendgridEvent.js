const Invitation = require('../models/Invitation');

const processSendgridEvent = async (event) => {
  const { email, event: type } = event;
  if (!email || !type) return;

  const update = {};

  switch (type) {
    case 'open':
      update['analytics.opened'] = true;
      break;
    case 'click':
      update['analytics.clicked'] = true;
      break;
    case 'unsubscribe':
      update.unsubscribed = true;
      update.consent = false
      break;
    case 'bounce':
      update.consent = false;
      break;
    default:
      return; // Ignore other events
  }

  await Invitation.findOneAndUpdate({ email }, { $set: update }, { new: true });
};

// Controller method for webhook route
exports.handleSendgridWebhook = async (req, res) => {
  try {
    const events = req.body;
    if (!Array.isArray(events)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    await Promise.all(events.map(processSendgridEvent));

    return res.status(200).json({ success: true, message: 'Events processed successfully' });
  } catch (err) {
    console.error('SendGrid Webhook Error:', err);
    return res.status(500).json({ success: false, message: 'Error processing events', error: err.message });
  }
};
