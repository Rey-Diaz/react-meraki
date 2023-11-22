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

import React, { useState, useEffect } from 'react';
import { fetchUplinkStatus } from '../services/MerakiService';
import CondensedView from '../components/CondensedView';
import ChangeLog from '../components/ChangeLog'; // Import the ChangeLog component
import styles from './HomePage.module.css'; // Import the CSS module

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUplinkStatus();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors here
      }
    };

    fetchData();
  }, []);

  // Calculate a summary from the data
  const totalNetworks = data.length;
  const totalUplinks = data.reduce((acc, network) => acc + network.uplinks.length, 0);

  return (
    <div className={styles.container}> {/* Apply styles to the entire container */}
      <h1 className={styles.header}>Meraki Uplinks Status</h1> {/* Apply header styles */}
      
      {/* Summary Section */}
      <div className={styles.summarySection}> {/* Apply summary section styles */}
        <h2 className={styles.pageTitle}>Project Summary</h2> {/* Apply page title styles */}
        <p className={styles.summaryDetails}>Total Networks: {totalNetworks}</p>
        <p className={styles.summaryDetails}>Total Uplinks: {totalUplinks}</p>
        {/* Add more project summary details as needed */}
      </div>

      {/* Condensed View */}
      <div className={styles.condensedViewSection}> {/* Apply condensed view section styles */}
        <h2 className={styles.pageTitle}>Condensed View</h2> {/* Apply page title styles */}
        <CondensedView data={data} /> {/* Display the condensed view */}
      </div>

      {/* Change Log Section */}
      <div className={styles.changeLogSection}> {/* Apply change log section styles */}
        <ChangeLog /> {/* Display the change log */}
      </div>
    </div>
  );
};

export default HomePage;
