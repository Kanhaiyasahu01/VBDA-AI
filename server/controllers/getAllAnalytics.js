const Invitation = require('../models/Invitation');

// Get all invitation analytics
exports.getAllAnalytics = async (req, res) => {
  try {
    const invitations = await Invitation.find({}, {
      firstName: 1,
      email: 1,
      'analytics.opened': 1,
      'analytics.clicked': 1,
      unsubscribed: 1,
      consent: 1,
      rsvp: 1
    });

    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
