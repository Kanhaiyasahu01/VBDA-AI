import axios from 'axios';

export const fetchTemplateByType = async (type) => {
    try {
      if (!type) {
        throw new Error('Type is required.');
      }
  
      // Make the API call to fetch the template by type
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-single-template/${type}`);
  
      // Check if the response is successful
      if (response.status === 200) {
        console.log('Template fetched successfully:', response.data.template);
        return { success: true, template: response.data.template };
      } else {
        throw new Error('Failed to fetch template.');
      }
    } catch (error) {
      console.error('Error fetching template by type:', error.message);
      return { success: false, error: error.message };
    }
  };