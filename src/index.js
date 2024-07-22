import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import BountyApp from './bounty/BountyApp';
import { ThemeProvider } from './themes/ThemeProvider.js';
import React from "react";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ThemeProvider>
          <BountyApp />
      </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();