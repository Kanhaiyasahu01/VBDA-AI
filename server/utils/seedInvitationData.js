const mongoose = require("mongoose");
const Invitation = require("../models/Invitation") // Assuming the Invitation model is in models/Invitation.js
const database = require("../config/database")
const seedDataInv = async () => {
  // Create two test dates for 5 and 10 days back
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5); // Subtract 5 days

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Subtract 10 days

  // Sample invitations data
  const invitations = [
    {
      firstName: "John",
      email: "john.doe@example.com",
      organization: "Organization A",
      role: "Speaker",
      achievement: "Researcher in AI",
      aiGeneratedContent: "Sample invitation content for John",
      emailSubject: "You're Invited to VBDA 2025",
      rsvp: false,
      consent: true,
      unsubscribed: false,
      scheduledDate: null,
      initialSentAt: fiveDaysAgo,
      status: {
        initial: true,
        followUp: false,
        finalReminder: false,
      },
      analytics: {
        opened: false,
        clicked: false,
        respondedAt: null,
      },
    },
    {
      firstName: "Alice",
      email: "alice.smith@example.com",
      organization: "Organization B",
      role: "Panelist",
      achievement: "Expert in Data Science",
      aiGeneratedContent: "Sample invitation content for Alice",
      emailSubject: "You're Invited to VBDA 2025",
      rsvp: false,
      consent: true,
      unsubscribed: false,
      scheduledDate: null,
      initialSentAt: tenDaysAgo,
      status: {
        initial: true,
        followUp: false,
        finalReminder: false,
      },
      analytics: {
        opened: false,
        clicked: false,
        respondedAt: null,
      },
    },
  ];

  try {
    // Insert seed data into the database
    await database.connect();
    await Invitation.insertMany(invitations);
    console.log("Seed data inserted successfully!");
    mongoose.disconnect();
    
  } catch (err) {
    console.error("Error inserting seed data:", err);
  }
};


seedDataInv();