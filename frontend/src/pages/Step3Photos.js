import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Step3Photos({ token, onEstimateReceived, onImagesUpload }) {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('✨ Select vehicle photos for damage analysis.');
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    onImagesUpload(selectedFiles);
  };

  if (!token) {
    return (
      <div className="App">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">🚗 CarDamageCalculator</p>
            <h1>AI-Powered Damage Estimates</h1>
          </div>
          <div className="status-chip">📊 Step 3/4</div>
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

  const handleEstimate = async () => {
    if (!images.length) return setMessage('🖼️ Please select at least one image.');
    try {
      const form = new FormData();
      images.forEach(file => form.append('images', file));
      const res = await fetch(`${API_BASE_URL}/estimate`, {
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Estimate received! Moving to results...');
        onEstimateReceived(data);
        setTimeout(() => navigate('/step4'), 500);
      } else {
        setMessage('❌ ' + (data.detail || 'Estimate failed.'));
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
        <div className="status-chip">📊 Step 3/4</div>
      </div>

      <div className="workflow-grid">
        <div className="step-card active">
          <h2>📷 3. Upload photos</h2>
          <p>Upload clear images of the vehicle damage for analysis.</p>
          <div className="upload-container">
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              onChange={handleImageSelect}
              accept="image/*" 
            />
            <label htmlFor="file-upload" className="upload-label">🖼️ Select Vehicle Photos</label>
          </div>
          {images.length > 0 && (
            <div className="upload-summary">
              <p className="badge success">✓ {images.length} file{images.length !== 1 ? 's' : ''} selected</p>
              <div className="upload-list">
                {images.map((file, index) => (
                  <div key={file.name} className="upload-item">
                    <div className="upload-item-icon">📄</div>
                    <div className="upload-item-info">
                      <p className="upload-item-name">{file.name}</p>
                      <p className="upload-item-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="upload-item-status">✓</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button disabled={!images.length} onClick={handleEstimate}>📊 Send for Estimate</button>
        </div>
      </div>

      <div className="message-bar">
        {message}
      </div>
    </div>
  );
}

export default Step3Photos;
