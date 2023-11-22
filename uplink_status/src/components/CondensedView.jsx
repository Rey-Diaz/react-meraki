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
