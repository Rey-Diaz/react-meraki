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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TableViewPage from './pages/TableViewPage';
import Navbar from './components/Navbar';
import styles from './app.module.css'; // Import the app.module.css file

function App() {
  return (
    <Router>
      <div className={styles.App}> {/* Apply styles to the entire app */}
        <header className={styles.navbar}> {/* Apply styles to the Navbar */}
          <Navbar /> {/* Include the Navbar component */}
        </header>
        <main className={styles.content}> {/* Apply styles to the main content */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/table-view" element={<TableViewPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
