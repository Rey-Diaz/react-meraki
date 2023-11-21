import axios from 'axios';

const SERVER_URL = 'http://localhost:3001/meraki-data'; // Replace with your server's URL

export const fetchUplinkStatus = async () => {
  try {
    const response = await axios.get(SERVER_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching Meraki data:', error);
    throw error;
  }
};
