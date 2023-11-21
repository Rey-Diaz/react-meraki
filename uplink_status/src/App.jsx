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
