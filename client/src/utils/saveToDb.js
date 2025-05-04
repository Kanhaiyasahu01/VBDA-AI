import axios from 'axios';

export const saveToDB = async (data) => {
  try {
    console.log("frontend row",data)
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/save-bulk-invitations`, data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Save DB Error:', err.message);
    return { success: false, error: err.message };
  }
};


export const saveRowToDB = async (row) => {
  try {
    console.log("frontend data" , row);
    const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/update-invitation`, row, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("res",response);

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update row in DB.');
    }

    console.log(`✅ Row updated successfully.`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error updating row in DB:', error);
    return { success: false, error: error.message };
  }
};
