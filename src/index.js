import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import "@carbon/charts/styles.css";
import axios from 'axios';

axios.defaults.baseURL = `http://localhost:8080`;

// Function to check if JWT is expired
const isTokenExpired = () => {
  const tokenIssuedTime = localStorage.getItem("tokenIssuedTime");
  if (!tokenIssuedTime) return true;

  const issuedTime = parseInt(tokenIssuedTime, 10);
  const currentTime = Date.now();
  const tokenLifetime = 25 * 60 * 1000; // 25 minutes in milliseconds

  return currentTime - issuedTime > tokenLifetime;
};

// Function to refresh JWT
const refreshToken = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authToken found");
    }

    const response = await axios.post("/auth/refresh-token", { token: authToken });
    const newJwt = response.data;

    // Update token and issued time in localStorage
    localStorage.setItem("token", newJwt);
    localStorage.setItem("tokenIssuedTime", Date.now().toString());

    // Update Axios default headers
    axios.defaults.headers.common["Authorization"] = `Bearer ${newJwt}`;
    console.log("Token refreshed successfully");

    // Schedule next refresh
    scheduleTokenRefresh();
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenIssuedTime");
    localStorage.removeItem("authToken");
    // Handle logout or redirection to login
  }
};

// Function to schedule token refresh
const scheduleTokenRefresh = () => {  
  const tokenIssuedTime = localStorage.getItem("tokenIssuedTime");
  if (!tokenIssuedTime) return;

  const issuedTime = parseInt(tokenIssuedTime, 10);
  const currentTime = Date.now();
  const tokenLifetime = 25 * 60 * 1000; // 25 minutes in milliseconds
  const refreshTime = issuedTime + tokenLifetime - currentTime - 60 * 1000; // Refresh 1 minute before expiry
  console.log(refreshTime);

  if (refreshTime > 0) {
    console.log(`Scheduling token refresh in ${refreshTime / 1000} seconds`);
    setTimeout(refreshToken, refreshTime);
  }
};

// Initialize token and check expiry
const initializeAuth = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isTokenExpired()) {
      await refreshToken();
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Schedule the next refresh
      scheduleTokenRefresh();
    }
  }
};

// React Application Render
const root = ReactDOM.createRoot(document.getElementById('root'));

initializeAuth().then(() => {
  root.render(
      <App />
  );
});
