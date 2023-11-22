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

// Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTable } from 'react-icons/fa'; // Import icons from react-icons
import styles from './Navbar.module.css'; // Import the CSS module

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/table-view">
            <FaTable /> Table View
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
