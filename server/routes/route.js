const express = require("express")
const router = express.Router();

const {saveBulkInvitations, updateInvitation} = require("../controllers/invitationController");
const {sendBulkEmail}  = require("../controllers/sendEmail")
const {getTemplates,updateTemplate,getTemplateByType} = require("../controllers/emailTemplateController")

router.post('/save-bulk-invitations', saveBulkInvitations);
router.put('/update-invitation', updateInvitation);

router.post('/send-emails', sendBulkEmail);


router.get('/get-template', getTemplates);
router.put('/update-template/:type', updateTemplate);
router.get('/get-single-template/:type',getTemplateByType)

module.exports = router