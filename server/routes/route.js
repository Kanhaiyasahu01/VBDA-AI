const express = require("express")
const router = express.Router();

const {saveBulkInvitations, updateInvitation} = require("../controllers/invitationController");
const {sendBulkEmail}  = require("../controllers/sendEmail")
const {getTemplates,updateTemplate,getTemplateByType} = require("../controllers/emailTemplateController")
const {handleSendgridWebhook } = require("../controllers/processSendgridEvent");
const {getAllAnalytics} = require("../controllers/getAllAnalytics")
const {rsvpInvite,unsubscribeInvite} = require("../controllers/emailResponseController");

router.post('/save-bulk-invitations', saveBulkInvitations);
router.put('/update-invitation', updateInvitation);

router.post('/send-emails', sendBulkEmail);


router.get('/get-template', getTemplates);
router.put('/update-template/:type', updateTemplate);
router.get('/get-single-template/:type',getTemplateByType)

router.post('/events', handleSendgridWebhook);
router.get('/analytics', getAllAnalytics);

// POST /rsvp/:id
router.post("/rsvp", rsvpInvite);

// POST /unsubscribe/:id
router.post("/unsubscribe", unsubscribeInvite);

module.exports = router