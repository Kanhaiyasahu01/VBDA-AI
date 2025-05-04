// scheduler.js
const cron = require('node-cron');
const EmailTemplate = require("../models/EmailTemplate");
const Invitation = require("../models/Invitation");
// const { generateEmails } = require('./generatemail');
// const { sendBulkEmails } = require('./emailsend');
const {generateEmails} = require("../utils/generateEmailServer");
const {sendBulkEmails} = require("../utils/emailSender")
/**
 * Scheduled job to send follow-up and reminder emails
 * Runs at 1:00 AM every day
 */
cron.schedule('0 1 * * *', async () => {
    console.log('🔁 Running email scheduler...');
    const now = new Date();
    
    try {
        console.log('Fetching invitations eligible for follow-up...');
        // Fetch invitations eligible for follow-up (5 days after initial send)
        const followUpInvitations = await Invitation.find({
          'status.followUp': false,
          initialSentAt: { $lte: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) }
        });
        console.log(`Found ${followUpInvitations.length} invitations for follow-up`);
        
        console.log('Fetching invitations eligible for final reminder...');
        // Fetch invitations eligible for final reminder (10 days after initial send and already followed up)
        const finalReminderInvitations = await Invitation.find({
          'status.followUp': true,
          'status.finalReminder': false,
          initialSentAt: { $lte: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) }
        });
        console.log(`Found ${finalReminderInvitations.length} invitations for final reminder`);
        
        // Fetch the templates for follow-up and final reminder
        console.log('Fetching email templates...');
        const followUpTemplate = await EmailTemplate.findOne({ type: "followup" });
        const finalReminderTemplate = await EmailTemplate.findOne({ type: "reminder" });
        
        if (!followUpTemplate) {
            console.error('❌ Follow-up email template not found');
        }
        
        if (!finalReminderTemplate) {
            console.error('❌ Final reminder email template not found');
        }
        
        // Process follow-up invitations
        if (followUpInvitations.length > 0 && followUpTemplate) {
            console.log(`Processing ${followUpInvitations.length} follow-up emails`);
            
            try {
                // Generate follow-up emails
                const generatedFollowUpEmails = await generateEmails(followUpInvitations, followUpTemplate);
                console.log(`Generated ${generatedFollowUpEmails.length} follow-up emails`);
                
                if (generatedFollowUpEmails.length > 0) {
                    // Send follow-up emails
                    const sendResult = await sendBulkEmails(generatedFollowUpEmails);
                    
                    if (sendResult) {
                        // Update follow-up status in DB
                        for (const invite of followUpInvitations) {
                            await Invitation.updateOne(
                                { _id: invite._id },
                                { $set: { "status.followUp": true, "followUpSentAt": new Date() } }
                            );
                            console.log(`📧 Follow-up email sent to ${invite.email}`);
                        }
                    } else {
                        console.error('❌ Failed to send follow-up emails');
                    }
                }
            } catch (error) {
                console.error('❌ Error processing follow-up emails:', error);
            }
        }
        
        // Process final reminder invitations
        if (finalReminderInvitations.length > 0 && finalReminderTemplate) {
            console.log(`Processing ${finalReminderInvitations.length} final reminder emails`);
            
            try {
                // Generate final reminder emails
                const generatedFinalReminderEmails = await generateEmails(finalReminderInvitations, finalReminderTemplate);
                console.log(`Generated ${generatedFinalReminderEmails.length} final reminder emails`);
                
                if (generatedFinalReminderEmails.length > 0) {
                    // Send final reminder emails
                    const sendResult = await sendBulkEmails(generatedFinalReminderEmails);
                    
                    if (sendResult) {
                        // Update final reminder status in DB
                        for (const invite of finalReminderInvitations) {
                            await Invitation.updateOne(
                                { _id: invite._id },
                                { $set: { "status.finalReminder": true, "finalReminderSentAt": new Date() } }
                            );
                            console.log(`📧 Final reminder email sent to ${invite.email}`);
                        }
                    } else {
                        console.error('❌ Failed to send final reminder emails');
                    }
                }
            } catch (error) {
                console.error('❌ Error processing final reminder emails:', error);
            }
        }
        
        console.log('✅ Email scheduler job completed.');
    } catch (error) {
        console.error('❌ Email scheduler job failed:', error);
    }
});

module.exports = { runScheduler: () => console.log('Email scheduler initialized') };