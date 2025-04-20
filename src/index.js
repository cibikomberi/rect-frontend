import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = `http://localhost:8080`;

const refreshToken = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authToken found");
    }

    const response = await axios.post("/auth/refresh-token", { token: authToken });
    const newJwt = response.data;

    localStorage.setItem("token", newJwt);
    localStorage.setItem("tokenIssuedTime", Date.now().toString());

    axios.defaults.headers.common["Authorization"] = `Bearer ${newJwt}`;
    console.log("Token refreshed successfully");

    scheduleTokenRefresh();
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenIssuedTime");
    localStorage.removeItem("authToken");
  }
};

const scheduleTokenRefresh = () => {
  const tokenIssuedTime = localStorage.getItem("tokenIssuedTime");
  if (!tokenIssuedTime) return;

  const issuedTime = parseInt(tokenIssuedTime, 10);
  const currentTime = Date.now();
  const tokenLifetime = 25 * 60 * 1000;
  const refreshTime = issuedTime + tokenLifetime - currentTime - 60 * 1000;
  console.log(refreshTime);

  if (refreshTime > 0) {
    console.log(`Scheduling token refresh in ${refreshTime / 1000} seconds`);
    setTimeout(refreshToken, refreshTime);
  }
};

const isTokenExpired = () => {
  const tokenIssuedTime = localStorage.getItem("tokenIssuedTime");
  if (!tokenIssuedTime) return true;

  const issuedTime = parseInt(tokenIssuedTime, 10);
  const currentTime = Date.now();
  const tokenLifetime = 25 * 60 * 1000;

  return currentTime - issuedTime > tokenLifetime;
};

const initializeAuth = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isTokenExpired()) {
      await refreshToken();
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      scheduleTokenRefresh();
    }
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
initializeAuth().then(() => {
  root.render(
      <App />
  );
})
