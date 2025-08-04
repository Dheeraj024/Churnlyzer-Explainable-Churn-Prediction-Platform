import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Upload from './pages/Upload';
import DataCleaning from './pages/DataCleaning';
import Training from './pages/Training';
import Prediction from './pages/Prediction';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Customer Churn Prediction</h1>
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/cleaning" element={<DataCleaning />} />
            <Route path="/training" element={<Training />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;