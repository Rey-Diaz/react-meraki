import React from 'react';

const CondensedView = ({ data }) => {
  // Assuming your data is an array of objects with network information
  // Modify this section to extract and display relevant information in the condensed view
  const condensedData = data.map((network, index) => (
    <div key={index} className="condensed-network">
      <h3>Network ID: {network.networkId}</h3>
      <p>Model: {network.model}</p>
      <p>Last Reported At: {network.lastReportedAt}</p>
      {/* Add more relevant data properties here */}
    </div>
  ));

  return (
    <div>
      <div className="condensed-container">
        {condensedData}
      </div>
    </div>
  );
};

export default CondensedView;
