const Invitation = require('../models/Invitation');

exports.saveBulkInvitations = async (req, res) => {
    try {
      const invitations = req.body;
      const validInvitations = invitations.filter(
        (inv) => inv.email && inv.firstName && typeof inv.email === 'string'
      );
  
      if (!validInvitations.length) {
        return res.status(400).json({ message: 'No valid invitations provided.' });
      }
  
      const inserted = await Invitation.insertMany(validInvitations, { ordered: false });
  
      res.status(200).json({
        message: 'Bulk invitations saved successfully.',
        insertedCount: inserted.length,
        inserted,
      });
    } catch (error) {
      console.error('Bulk Insert Error:', error);
      res.status(500).json({
        message: 'Bulk insert failed.',
        error: error.message,
      });
    }
  };
  
  

exports.updateInvitation = async (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData || !updatedData._id) {
      return res.status(400).json({ message: 'Missing required identifier (_id).' });
    }

    const updatedDoc = await Invitation.findByIdAndUpdate(
      updatedData._id,
      updatedData,
      { new: true } // return the updated document
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Invitation not found.' });
    }

    res.status(200).json({ message: 'Invitation updated successfully.', data: updatedDoc });
  } catch (error) {
    console.error('Error updating invitation:', error);
    res.status(500).json({ message: 'Server error while updating invitation.', error: error.message });
  }
};

