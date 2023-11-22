{/* Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
           https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied. */}

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();

// Setting up CORS with specific origin and methods
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET',
}));

// Fetch network data from Meraki API
async function fetchNetworkData() {
  try {
    const response = await axios.get(
      `https://api.meraki.com/api/v1/organizations/${process.env.ORG_ID}/networks`,
      { headers: {'X-Cisco-Meraki-API-Key': process.env.MERAKI_API_KEY} }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching network data:', error);
    return null;
  }
}

// Fetch and enrich Meraki data
async function fetchMerakiData() {
  try {
    const [uplinkData, networkData] = await Promise.all([
      axios.get(
        `https://api.meraki.com/api/v1/organizations/${process.env.ORG_ID}/uplinks/statuses`,
        { headers: {'X-Cisco-Meraki-API-Key': process.env.MERAKI_API_KEY} }
      ),
      fetchNetworkData()
    ]);

    // Enrich uplink data with network names
    const enrichedUplinkData = uplinkData.data.map(uplink => {
      const network = networkData.find(n => n.id === uplink.networkId);
      return { ...uplink, networkName: network ? network.name : 'Unknown' };
    });

    // console.log("Enriched Uplink Data:", enrichedUplinkData);
    return { uplinkData: enrichedUplinkData, networkData };
  } catch (error) {
    console.error('Error fetching Meraki data:', error);
    return null;
  }
}

// Endpoint to get enriched Meraki data
app.get('/meraki-data', async (req, res) => {
  try {
    const enrichedData = await fetchMerakiData();
    res.json(enrichedData.uplinkData);
  } catch (error) {
    console.error('Error in /meraki-data route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Load the DUPLICATE_TIME_WINDOW from the .env file
const duplicateTimeWindow = parseInt(process.env.DUPLICATE_TIME_WINDOW) || 300000; // Default to 5 minutes if not defined

// Function to determine if a change should be logged
function shouldLogChange(deviceSerial, interface) {
  const currentTime = new Date();

  // Check for duplicates within the time window
  const recentChanges = changeLog.filter(entry =>
    entry.serial === deviceSerial &&
    entry.interface === interface &&
    currentTime - new Date(entry.timestamp) < duplicateTimeWindow
  );

  // If duplicates are found, skip logging
  if (recentChanges.length > 0) {
    console.log(`Skipping duplicate log for ${deviceSerial} - ${interface}`);
    return false;
  }

  return true;
}

// Function to format change log entry
function formatChangeLogEntry(entry) {
  return `Network ID: ${entry.networkId}\n` +
         `Network Name: ${entry.networkName}\n` +
         `Device Serial: ${entry.serial}\n` +
         `Interface: ${entry.interface}\n` +
         `Old Status: ${entry.oldStatus}\n` +
         `New Status: ${entry.newStatus}\n` +
         `Timestamp: ${entry.timestamp}`;
}

// Function to compare uplink data
function compareUplinkData(currentData, networkData) {
  if (!lastApiResponse) {
    lastApiResponse = currentData;
    return;
  }

  currentData.forEach(device => {
    const lastDevice = lastApiResponse.find(d => d.serial === device.serial);
    if (lastDevice) {
      device.uplinks.forEach(uplink => {
        const lastUplink = lastDevice.uplinks.find(u => u.interface === uplink.interface);
        if (lastUplink && lastUplink.status === 'active' && uplink.status !== 'active' && shouldLogChange(device.serial, uplink.interface)) {
          const changeLogEntry = {
            networkId: device.networkId,
            networkName: networkData.find(n => n.id === device.networkId)?.name || 'Unknown',
            serial: device.serial,
            interface: uplink.interface,
            oldStatus: lastUplink.status,
            newStatus: uplink.status,
            timestamp: new Date().toISOString()
          };

          changeLog.push(changeLogEntry);
          sendEmail("Device Status Change Alert", formatChangeLogEntry(changeLogEntry));
        }
      });
    }
  });

  lastApiResponse = currentData;
}

// Variables for storing API response and change log
let lastApiResponse = null;
let changeLog = [];

// Email sending function using Nodemailer with Mailtrap SMTP
async function sendEmail(subject, body) {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: subject,
    text: body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Endpoint to retrieve the change log
app.get('/change-log', (req, res) => {
  res.json(changeLog);
});

// Variables for tracking API calls
let apiCallCounter = 0;
let lastApiCallTime = null;

// Periodic task to fetch Meraki data
setInterval(async () => {
  const enrichedData = await fetchMerakiData();
  if (enrichedData) {
    compareUplinkData(enrichedData.uplinkData, enrichedData.networkData);
    apiCallCounter++;
    lastApiCallTime = new Date();
  }
}, 60000);

// Endpoint to retrieve API call count and last sync time
app.get('/api-call-count', (req, res) => {
  res.json({ count: apiCallCounter, lastSync: lastApiCallTime });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
