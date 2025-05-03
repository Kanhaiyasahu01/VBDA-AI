const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  organization: { type: String },
  role: { type: String },
  achievement: { type: String },

  // Email Content (Generated + Editable)
  aiGeneratedContent: { type: String },          // Raw AI suggestion
  emailSubject: { type: String, default: "You're Invited to VBDA 2025" },

  // Invitation Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'opened', 'responded', 'unsubscribed', 'failed'],
    default: 'pending'
  },

  // Tracking
  sentAt: { type: Date },
  openedAt: { type: Date },
  respondedAt: { type: Date },
  followUpCount: { type: Number, default: 0 },
  rsvp: { type: Boolean, default: false },

  // Scheduling
  scheduleDate: { type: Date },

  // Consent & Unsubscribe
  consent: { type: Boolean, default: true },
  unsubscribed: { type: Boolean, default: false },

  // System metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
