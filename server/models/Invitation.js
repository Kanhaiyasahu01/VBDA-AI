const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    organization: { type: String },
    role: { type: String },
    achievement: { type: String },

    aiGeneratedContent: { type: String },
    emailSubject: { type: String, default: "You're Invited to VBDA 2025" },

    rsvp: { type: Boolean, default: false },
    consent: { type: Boolean, default: true },
    unsubscribed: { type: Boolean, default: false },
    
    scheduledDate: { type: Date , default:null}, // null if send now
    initialSentAt: { type: Date }, // either now or scheduledDate

    status: {
      initial: { type: Boolean, default: true },
      followUp: { type: Boolean, default: false },
      finalReminder: { type: Boolean, default: false },
    },

    analytics: {
      opened: { type: Boolean, default: false },
      clicked: { type: Boolean, default: false },
      respondedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", invitationSchema);
