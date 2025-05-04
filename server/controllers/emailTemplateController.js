const EmailTemplate = require('../models/EmailTemplate');

// GET all templates
exports.getTemplates = async (req, res) => {
  const templates = await EmailTemplate.find({});
  res.json(templates);
};

exports.getTemplateByType = async (req, res) => {
    try {
      const { type } = req.params;
  
      // Check if the type is provided
      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'Type is required.'
        });
      }
  
      // Try to find the template by type
      const template = await EmailTemplate.findOne({ type });
  
      // If no template is found
      if (!template) {
        return res.status(404).json({
          success: false,
          message: `Template with type '${type}' not found.`
        });
      }
  
      // Return the template if found
      return res.status(200).json({
        success: true,
        template
      });
    } catch (error) {
      // Catch any unexpected errors
      console.error('Error fetching template:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error.'
      });
    }
  };
  
// UPDATE template
exports.updateTemplate = async (req, res) => {
  const { type } = req.params;
  const { subject, body } = req.body;

  const updated = await EmailTemplate.findOneAndUpdate(
    { type },
    { subject, body },
    { new: true, upsert: false }
  );

  if (!updated) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.json(updated);
};
