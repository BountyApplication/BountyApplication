import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import TicTacToe from './TicTacToe';
import BountyApp from './bounty/BountyApp';

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <TicTacToe /> */}
    <BountyApp />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();