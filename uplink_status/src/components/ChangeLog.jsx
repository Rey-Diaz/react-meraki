import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table'; // Import useSortBy
import { FaSync } from 'react-icons/fa'; // Import the refresh icon
import styles from './ChangeLog.module.css';

function ChangeLog() {
  const [log, setLog] = useState([]);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await axios.get('http://localhost:3001/change-log');
        setLog(response.data);
      } catch (error) {
        console.error('Error fetching change log:', error);
      }
    };

    const fetchApiCallCount = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api-call-count');
        setApiCallCount(response.data.count);
        setLastSync(response.data.lastSync);
      } catch (error) {
        console.error('Error fetching API call count:', error);
      }
    };

    fetchLog();
    fetchApiCallCount();
    const interval = setInterval(fetchApiCallCount, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const timeSinceLastSync = () => {
    if (!lastSync) return 'N/A';
    const now = new Date();
    const lastSyncTime = new Date(lastSync);
    const secondsElapsed = Math.round((now - lastSyncTime) / 1000);
    return `${secondsElapsed} seconds ago`;
  };

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Network ID',
        accessor: 'networkId',
      },
      {
        Header: 'Serial',
        accessor: 'serial',
      },
      {
        Header: 'Interface',
        accessor: 'interface',
      },
      {
        Header: 'Old Status',
        accessor: 'oldStatus',
      },
      {
        Header: 'New Status',
        accessor: 'newStatus',
      },
    ],
    []
  );

  // Create a table instance with sorting functionality
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: log,
    },
    useSortBy // Enable sorting
  );

  return (
    <div className={styles.changeLog}>
      <h2 className={styles.title}>
        Change Log (API Calls: {apiCallCount}, Last Synced: {timeSinceLastSync()})
      </h2>
      <button className={styles.resetButton}>
        <FaSync className={styles.icon} /> Refresh
      </button>
      <table className={styles.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ChangeLog;
