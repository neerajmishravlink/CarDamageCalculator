import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Step1Auth from './pages/Step1Auth';
import Step2Location from './pages/Step2Location';
import Step3Photos from './pages/Step3Photos';
import Step4Estimate from './pages/Step4Estimate';

function AppRouter() {
  const [token, setToken] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get('token');
    if (queryToken) {
      setToken(queryToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleTokenVerified = (accessToken) => {
    setToken(accessToken);
  };

  const handleLocationResolved = (location) => {
    // Store location data if needed
  };

  const handleEstimateReceived = (estimateData) => {
    setEstimate(estimateData);
  };

  const handleImagesUpload = (images) => {
    setUploadedImages(images);
  };

  return (
    <Routes>
      <Route 
        path="/step1" 
        element={<Step1Auth token={token} setToken={setToken} onTokenVerified={handleTokenVerified} />} 
      />
      <Route 
        path="/step2" 
        element={<Step2Location token={token} onLocationResolved={handleLocationResolved} />} 
      />
      <Route 
        path="/step3" 
        element={<Step3Photos token={token} onEstimateReceived={handleEstimateReceived} onImagesUpload={handleImagesUpload} />} 
      />
      <Route 
        path="/step4" 
        element={<Step4Estimate token={token} estimate={estimate} uploadedImages={uploadedImages} />} 
      />
      <Route path="/" element={<Step1Auth token={token} setToken={setToken} onTokenVerified={handleTokenVerified} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
