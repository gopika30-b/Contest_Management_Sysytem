import React, { useState } from 'react';
import AdminPage from './admin/AdminPage';
import StudentPage from './student/StudentPage';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(0);
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const { message, componentName, username: loggedInUsername } = response.data;
      if (message === "True") {
        if (componentName === "AdminPage") {
          setIsLoggedIn(1);
          setUsername(loggedInUsername);
        } else if (componentName === "StudentPage") {
          setIsLoggedIn(2);
          setUsername(loggedInUsername); 
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  if (isLoggedIn === 2) {
    return <StudentPage username={username} />;
  } else if (isLoggedIn === 1) {
    return <AdminPage username={username} />;
  } else {
    return (
      <div className="login-page">
        <div className="login-form">
          <h2>Login Page</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <label>Username:<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></label><br />
            <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><br />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }
};

export default LoginPage;