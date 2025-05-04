const Invitation = require('../models/Invitation');

// Save multiple invitations
exports.saveBulkInvitations = async (req, res) => {
  try {
    const invitations = req.body;

    // Validate each invitation
    const validInvitations = invitations.filter(
      (inv) => inv.email && inv.firstName && typeof inv.email === 'string'
    );

    if (!validInvitations.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid invitations provided.',
      });
    }

    // Insert into DB
    const inserted = await Invitation.insertMany(validInvitations, { ordered: false });

    return res.status(200).json({
      success: true,
      message: 'Bulk invitations saved successfully.',
      data: {
        inserted,
        insertedCount: inserted.length,
      },
    });
  } catch (error) {
    console.error('Bulk Insert Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Bulk insert failed.',
      error: error.message,
    });
  }
};

// Update a single invitation
exports.updateInvitation = async (req, res) => {
    try {
      const updatedData = req.body;
      console.log("backend updated data", updatedData);
  
      if (!updatedData || !updatedData.email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required identifier (email).',
        });
      }
  
      const updatedDoc = await Invitation.findOneAndUpdate(
        { email: updatedData.email },  // Correct filter object
        updatedData,
        { new: true }  // Return the updated document
      );
  
      if (!updatedDoc) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Invitation updated successfully.',
        data: updatedDoc,
      });
    } catch (error) {
      console.error('Error updating invitation:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating invitation.',
        error: error.message,
      });
    }
  };
  
