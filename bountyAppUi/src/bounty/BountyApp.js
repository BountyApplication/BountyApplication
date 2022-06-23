import '../App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AdminUi from './adminUi/AdminUi';
import GeneralUi from './generalUi/GeneralUi';
import TicTacToe from '../TicTacToe';
import "./util/GeneralUi.css"

export default function BountyApp() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<React.StrictMode><GeneralUi /></React.StrictMode>} />
          <Route path="/admin" element={<AdminUi />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
        </Routes>
      </div>
    </Router>
  );
}