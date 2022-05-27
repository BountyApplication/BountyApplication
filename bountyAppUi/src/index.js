import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import BountyApp from './bounty/BountyApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <meta name="viewport" content="width=device-width, intitial-scale=1.0"/> */}
    {/* <App /> */}
    <BountyApp />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();