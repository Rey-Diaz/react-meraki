import React, { useEffect, useState } from 'react';
import { fetchUplinkStatus } from '../services/MerakiService';
import Table from '../components/Table';
import styles from './TableViewPage.module.css'; // Import the CSS module

const TableViewPage = () => {
  const [uplinkStatus, setUplinkStatus] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUplinkStatus();
        setUplinkStatus(data || []); // Ensure data is not null
        setError(null);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data.');
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.pageContainer}> {/* Apply the page container styling */}
      <h1 className={styles.pageTitle}>Uplink Status</h1> {/* Apply the page title styling */}
      {error ? (
        <p className={styles.errorMessage}>Error: {error}</p> 
      ) : (
        <div className={styles.tableContainer}> {/* Apply the table container styling */}
          <Table data={uplinkStatus} /> {/* Use the Table component */}
        </div>
      )}
    </div>
  );
};

export default TableViewPage;
