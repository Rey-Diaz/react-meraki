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
