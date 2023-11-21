import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table'; // Import the necessary hooks
import styles from './Table.module.css';

const Table = ({ data }) => {
  // Custom filter function
  const customFilter = (rows, ids, filterValue) => {
    return rows.filter(row => {
      return ids.some(id => {
        const rowValue = row.values[id];
        // Handle different data types (e.g., string, array) here
        return rowValue !== undefined
          ? String(rowValue).toLowerCase().includes(filterValue.toLowerCase())
          : false;
      });
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Network ID',
        accessor: 'networkId',
      },
      {
        Header: 'Network Name',
        accessor: 'networkName',
      },
      {
        Header: 'Serial',
        accessor: 'serial',
      },
      {
        Header: 'Model',
        accessor: 'model',
      },
      {
        Header: 'Last Reported At',
        accessor: 'lastReportedAt',
      },
      {
        Header: 'Uplinks',
        accessor: 'uplinks',
        Cell: ({ cell }) => {
          const uplinks = cell.value.map((uplink, index) => (
            <div key={index}>
              <p><strong>Interface:</strong> {uplink.interface}</p>
              <p><strong>Status:</strong> {uplink.status}</p>
              <p><strong>IP:</strong> {uplink.ip}</p>
              {/* Add more uplink properties as needed */}
            </div>
          ));
          return <div>{uplinks}</div>;
        },
      },
      // Add more columns as needed
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: customFilter }, // Set the custom filter as the default
    },
    useFilters, // Enable filtering
    useSortBy // Enable sorting
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined; // Set filter value to undefined if it's empty
    setFilter('networkId', value); // This will now use the custom filter function
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Network ID"
          onChange={handleFilterChange}
        />
      </div>
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
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
