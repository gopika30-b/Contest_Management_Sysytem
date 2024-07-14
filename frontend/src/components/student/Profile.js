import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({username}) =>{
    const [fullName, setFullName] = useState('');
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setFullName(response.data.fullName);
        setDept(response.data.dept);
        setYear(response.data.year);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);
    return (
        <div className="profile-container">
      <div className="profile-box">
        <h2>Profile</h2>
        <div className="profile-info">
          <p>Name: {fullName}</p>
          <p>Department: {dept}</p>
          <p>Year: {year}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;