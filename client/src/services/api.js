import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getBillsByAddress = async (address) => {
  try {
    const response = await axios.get(`${API_URL}/bills`, { params: { address } });
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
};
