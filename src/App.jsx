import React from 'react';
import { Route, Routes } from "react-router-dom";
import UserPage from './components/UserPage';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import ClientContactInfo from './components/ClientContactInfo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/clientcontacts" element={<ClientContactInfo />} />
      </Routes>
    </div>
  );
}

export default App;
