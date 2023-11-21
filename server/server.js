// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3001; // Use the provided PORT or default to 3001

// Load environment variables from .env file
require('dotenv').config();

// Configure CORS to allow requests from your client application's origin
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the actual origin of your client app
  methods: 'GET', // Add other HTTP methods if needed
}));

// Function to make the API call for uplink statuses
async function fetchMerakiData() {
  try {
    const response = await axios.get(
      `https://api.meraki.com/api/v1/organizations/${process.env.ORG_ID}/uplinks/statuses`,
      {
        headers: {
          'X-Cisco-Meraki-API-Key': process.env.MERAKI_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Meraki data:', error);
    return null;
  }
}

// Function to fetch network names
async function fetchNetworkNames() {
  try {
    const networksResponse = await axios.get(
      `https://api.meraki.com/api/v1/organizations/${process.env.ORG_ID}/networks`,
      {
        headers: {
          'X-Cisco-Meraki-API-Key': process.env.MERAKI_API_KEY,
        },
      }
    );
    return networksResponse.data;
  } catch (error) {
    console.error('Error fetching network names:', error);
    return null;
  }
}

let apiCallCounter = 0;
let lastApiCallTime = null;

// Set up the interval to call the API every 2 minutes (120000 milliseconds)
setInterval(async () => {
  const uplinkData = await fetchMerakiData();
  const networkNames = await fetchNetworkNames();

  if (uplinkData && networkNames) {
    const mergedData = uplinkData.map(device => {
      const network = networkNames.find(net => net.id === device.networkId);
      return { ...device, networkName: network ? network.name : 'Unknown' };
    });

    compareUplinkData(mergedData);
    apiCallCounter++;
    lastApiCallTime = new Date(); // Record the timestamp
  }
  // TODO: Add any additional logic you need here
}, 60000);

let lastApiResponse = null; // Variable to store the last API response
let changeLog = []; // Array to log changes

// Function to compare uplink data
function compareUplinkData(currentData) {
  if (!lastApiResponse) {
    lastApiResponse = currentData;
    return;
  }

  currentData.forEach(device => {
    const lastDevice = lastApiResponse.find(d => d.serial === device.serial);
    if (lastDevice) {
      device.uplinks.forEach(uplink => {
        const lastUplink = lastDevice.uplinks.find(u => u.interface === uplink.interface);
        if (lastUplink && lastUplink.status !== uplink.status) {
          // Log the change
          changeLog.push({
            networkId: device.networkId,
            networkName: device.networkName, // Include network name in the log
            serial: device.serial,
            interface: uplink.interface,
            oldStatus: lastUplink.status,
            newStatus: uplink.status,
            timestamp: new Date().toISOString()
          });
        }
      });
    }
  });

  // Update the lastApiResponse for the next comparison
  lastApiResponse = currentData;
}

// Endpoint to get the change log
app.get('/change-log', (req, res) => {
  res.json(changeLog);
});
app.get('/api-call-count', (req, res) => {
  res.json({ count: apiCallCounter, lastSync: lastApiCallTime });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
