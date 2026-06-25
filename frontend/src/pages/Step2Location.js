import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Step2Location({ token, onLocationResolved }) {
  const [location, setLocation] = useState({ lat: '40.7128', lon: '-74.0060' });
  const [locationResult, setLocationResult] = useState(null);
  const [message, setMessage] = useState('✨ Enter your vehicle location for accurate pricing.');
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="App">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">🚗 CarDamageCalculator</p>
            <h1>AI-Powered Damage Estimates</h1>
          </div>
          <div className="status-chip">📊 Step 2/4</div>
        </div>
        <div className="workflow-grid">
          <div className="step-card">
            <p style={{color: '#ef4444'}}>❌ Please complete step 1 (authentication) first.</p>
            <button onClick={() => navigate('/step1')}>← Back to Step 1</button>
          </div>
        </div>
      </div>
    );
  }

  const handleLocation = async () => {
    if (!location.lat || !location.lon) return setMessage('📍 Please enter latitude and longitude.');
    try {
      const res = await fetch(`${API_BASE_URL}/location?lat=${location.lat}&lon=${location.lon}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLocationResult(data);
        setMessage('✅ Location verified! Moving to photo upload...');
        onLocationResolved(data);
        setTimeout(() => navigate('/step3'), 500);
      } else {
        setMessage('❌ ' + (data.detail || 'Location resolution failed.'));
      }
    } catch (error) {
      setMessage('⚠️ Unable to reach the backend. Is the API running?');
    }
  };

  return (
    <div className="App">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">🚗 CarDamageCalculator</p>
          <h1>AI-Powered Damage Estimates</h1>
          <p>Upload vehicle photos, verify your session, and get an instant damage assessment with accurate repair costs.</p>
        </div>
        <div className="status-chip">📊 Step 2/4</div>
      </div>

      <div className="workflow-grid">
        <div className="step-card active">
          <h2>📍 2. Share location</h2>
          <p>Enter your vehicle's location to get accurate local pricing.</p>
          <div className="location-form">
            <div className="location-inputs">
              <div className="location-input-group">
                <label>📐 Latitude</label>
                <input 
                  value={location.lat} 
                  onChange={e => setLocation({ ...location, lat: e.target.value })} 
                  placeholder="e.g., 40.7128" 
                  type="number" 
                  step="0.0001" 
                />
              </div>
              <div className="location-input-group">
                <label>📐 Longitude</label>
                <input 
                  value={location.lon} 
                  onChange={e => setLocation({ ...location, lon: e.target.value })} 
                  placeholder="e.g., -74.0060" 
                  type="number" 
                  step="0.0001" 
                />
              </div>
            </div>
            <button onClick={handleLocation}>🌍 Resolve Location</button>
          </div>
          {locationResult && (
            <div className="location-result">
              <p className="badge success">✓ Location verified</p>
              <div className="location-details">
                <div className="location-detail-item">
                  <div className="detail-icon">🏙️</div>
                  <div className="detail-content">
                    <p className="detail-label">City</p>
                    <p className="detail-value">{locationResult.city || 'Unknown'}</p>
                  </div>
                </div>
                <div className="location-detail-item">
                  <div className="detail-icon">🗺️</div>
                  <div className="detail-content">
                    <p className="detail-label">Region</p>
                    <p className="detail-value">{locationResult.region || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="message-bar">
        {message}
      </div>
    </div>
  );
}

export default Step2Location;
