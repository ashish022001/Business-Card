// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRGeneratorPage from './Components/QRpage';
import BusinessCardDisplay from './Components/RegistrationForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRGeneratorPage />} />
        <Route path="/business-card" element={<BusinessCardDisplay />} />
      </Routes>
    </Router>
  );
};

export default App;
