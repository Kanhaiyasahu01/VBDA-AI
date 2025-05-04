const express = require("express")
const router = express.Router();

const {saveBulkInvitations, updateInvitation} = require("../controllers/invitationController");
const {sendBulkEmail}  = require("../controllers/sendEmail")
router.post('/save-bulk-invitations', saveBulkInvitations);
router.put('/update-invitation', updateInvitation);

router.post('/send-emails', sendBulkEmail);


module.exports = router