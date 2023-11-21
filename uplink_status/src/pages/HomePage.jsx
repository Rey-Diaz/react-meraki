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
