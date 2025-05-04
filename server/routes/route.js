const express = require("express")
const router = express.Router();

const {saveBulkInvitations, updateInvitation} = require("../controllers/invitationController");
const {sendBulkEmail}  = require("../controllers/sendEmail")
const {getTemplates,updateTemplate,getTemplateByType} = require("../controllers/emailTemplateController")
const {handleSendgridWebhook } = require("../controllers/processSendgridEvent");
const {getAllAnalytics} = require("../controllers/getAllAnalytics")

router.post('/save-bulk-invitations', saveBulkInvitations);
router.put('/update-invitation', updateInvitation);

router.post('/send-emails', sendBulkEmail);


router.get('/get-template', getTemplates);
router.put('/update-template/:type', updateTemplate);
router.get('/get-single-template/:type',getTemplateByType)

router.post('/events', handleSendgridWebhook);
router.get('/analytics', getAllAnalytics);



module.exports = router