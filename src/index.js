import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import "@carbon/charts/styles.css";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);