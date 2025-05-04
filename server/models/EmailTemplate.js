const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['initial', 'followup', 'reminder'],
    required: true,
    unique: true
  },
  subject: String,
  body: String
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
