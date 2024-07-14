import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';
import Dashboard from './Dashboard';
import AddContest from './AddContest';
import Profile from './Profile';
import './AdminPage.css';
const AdminPage = ({ username }) => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setFullName(response.data.fullName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);
  return (
    <div className='student-page-container'>
    <div className='navbar'>
      <h1>Welcome, {fullName || 'Loading...'}!</h1>
      <br/><br/>
      <Router>
        <div className='nav-links'>
          <div className='nav-link'><Link to="/dashboard">Dashboard</Link></div>
          <div className='nav-link'><Link to="/addcontest">Add Contest</Link></div>
          <div className='nav-link'><Link to="/profile">Profile</Link></div>
        </div>

        <br /><hr /><br />
        <div className='content'>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard username={username} />} />
            <Route path="/addcontest" element={<AddContest username={username}/>}/>
            <Route path="/profile" element={<Profile username={username} />} />
          </Routes>
        </div>

      </Router>
    </div>

  </div>
    
  );
};

export default AdminPage;