// controllers/invitationController.js
const Invitation = require("../models/Invitation");

// RSVP Handler
exports.rsvpInvite = async (req, res) => {
  const { email, response } = req.body; // Receive the email and response from the request body
  
  try {
    // You can validate the email or process it as needed
    const invitation = await Invitation.findOne({ email });

    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invitation not found." });
    }

    invitation.rsvp = response; // Update RSVP status
    await invitation.save(); // Save the changes to the database

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("RSVP Error:", error);
    res.status(500).json({ success: false, message: "RSVP failed" });
  }
};

// Unsubscribe Handler
exports.unsubscribeInvite = async (req, res) => {
  const { email } = req.body; // Receive the email from the request body

  try {
    const invitation = await Invitation.findOne({ email });

    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invitation not found." });
    }

    invitation.unsubscribed = true; // Mark as unsubscribed
    await invitation.save(); // Save the changes to the database

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).json({ success: false, message: "Unsubscribe failed" });
  }
};
