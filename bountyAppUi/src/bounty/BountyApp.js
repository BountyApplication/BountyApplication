// import '../App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AdminUi from './adminUi/AdminUi';
import GeneralUi from './generalUi/GeneralUi';
import TicTacToe from '../TicTacToe';
import { ThemeContext } from "../themes/ThemeProvider.js";
import React, { useContext } from "react";
import "./util/GeneralUi.css"
import ChangeMoneyUi from "./util/ChangeMoneyUi";

export default function BountyApp() {
  const { theme } = useContext(ThemeContext);
  const LightTheme = React.lazy(() => import('../themes/lightTheme'));
  const DarkTheme = React.lazy(() => import('../themes/darkTheme'));

  const ThemeSelector = ({ children }) => {
    return (
      <>
        <React.Suspense fallback={<></>}>
          {(theme === "dark-theme") && <DarkTheme />}
          {(theme === "light-theme") && <LightTheme />}
          {children}
        </React.Suspense>
      </>
    )
  }

  return (
    <div>
       <Router>
      <div className='App'>
        <ThemeSelector>
        <Routes>
          <Route path="/" element={<React.StrictMode><GeneralUi /></React.StrictMode>} />
          <Route path="/admin" element={<AdminUi />} />
          <Route path="/wechselgeld" element={<ChangeMoneyUi />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
        </Routes>
        </ThemeSelector>
      </div>
    </Router>


    </div>
  );
}