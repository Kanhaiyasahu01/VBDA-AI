const database = require("../config/database");
const EmailTemplate= require("../models/EmailTemplate")
const mongoose = require("mongoose")
const seedData = [
  {
    type: 'initial',
    subject: 'Welcome to Our Service',
    body: 'Hi {{name}}, thank you for signing up!'
  },
  {
    type: 'followup',
    subject: 'Just Checking In',
    body: 'Hi {{name}}, we noticed you haven\'t responded yet.'
  },
  {
    type: 'reminder',
    subject: 'Final Reminder',
    body: 'Hi {{name}}, this is your last chance to act!'
  }
];

async function seedTemplates() {
  try {
    
    await database.connect();
    const res = await EmailTemplate.insertMany(seedData);
    console.log('Seed successful:', res);

    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedTemplates();
