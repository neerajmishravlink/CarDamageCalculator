import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Ready to start your estimate.');
  const [token, setToken] = useState('');
  const [magicLink, setMagicLink] = useState('');
  const [verified, setVerified] = useState(false);
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [locationResult, setLocationResult] = useState(null);
  const [images, setImages] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get('token');
    if (queryToken) {
      setToken(queryToken);
      verifyToken(queryToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const verifyToken = async (incomingToken) => {
    if (!incomingToken) return setMessage('Paste the magic token or JWT first.');

    try {
      const params = new URLSearchParams({ token: incomingToken });
      const res = await fetch(`${API_BASE_URL}/auth/verify?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setMessage('Verified successfully. You can now proceed to location and upload.');
        setToken(data.access_token);
        setVerified(true);
        setStep(2);
      } else {
        setMessage(data.detail || 'Verification failed.');
        setVerified(false);
      }
    } catch (error) {
      setMessage('Unable to reach the backend. Is the API running?');
      setVerified(false);
    }
  };

  const handleSendLink = async () => {
    if (!email) return setMessage('Please enter an email address.');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.magic_token || '');
        setMagicLink(data.magic_link || '');
        setMessage('Magic link generated. Paste the token below or click the link.');
        setStep(1);
      } else {
        setMessage(data.detail || 'Unable to request magic link.');
      }
    } catch (error) {
      setMessage('Unable to reach the backend. Is the API running?');
    }
  };

  const handleVerify = async () => {
    await verifyToken(token);
  };

  const handleLocation = async () => {
    if (!location.lat || !location.lon) return setMessage('Please enter latitude and longitude.');
    try {
      const res = await fetch(`${API_BASE_URL}/location?lat=${location.lat}&lon=${location.lon}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLocationResult(data);
        setMessage('Location resolved successfully.');
        setStep(3);
      } else {
        setMessage(data.detail || 'Location resolution failed.');
      }
    } catch (error) {
      setMessage('Unable to reach the backend. Is the API running?');
    }
  };

  const handleEstimate = async () => {
    if (!images.length) return setMessage('Please select at least one image.');
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
        setEstimate(data);
        setMessage('Estimate completed!');
        setStep(4);
      } else {
        setMessage(data.detail || 'Estimate failed.');
      }
    } catch (error) {
      setMessage('Unable to reach the backend. Is the API running?');
    }
  };

  return (
    <div className="App">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">CarDamageCalculator</p>
          <h1>Get a fast AI-powered repair estimate</h1>
          <p>Upload vehicle photos, verify your session, and receive a quick damage/cost summary in minutes.</p>
        </div>
        <div className="status-chip">Step {step} of 4</div>
      </div>

      <div className="workflow-grid">
        <div className={`step-card ${step === 1 ? 'active' : ''}`}>
          <h2>1. Request access</h2>
          <p>Enter your email to receive a magic authentication link.</p>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <button onClick={handleSendLink}>Request Link</button>
          {magicLink && (
            <div className="magic-link-panel">
              <p><strong>Magic Link:</strong></p>
              <a href={magicLink} target="_blank" rel="noreferrer">Open verification link</a>
            </div>
          )}
          <label>Token / JWT</label>
          <input value={token} onChange={e => setToken(e.target.value)} placeholder="Paste JWT or magic token" />
          <button className="secondary" onClick={handleVerify}>Verify Session</button>
        </div>

        <div className={`step-card ${step === 2 ? 'active' : ''} ${verified ? '' : 'disabled'}`}>
          <h2>2. Share location</h2>
          <p>Enter coordinates to resolve local pricing and repair context.</p>
          <div className="inline-inputs">
            <input value={location.lat} onChange={e => setLocation({ ...location, lat: e.target.value })} placeholder="Latitude" />
            <input value={location.lon} onChange={e => setLocation({ ...location, lon: e.target.value })} placeholder="Longitude" />
          </div>
          <button disabled={!verified} onClick={handleLocation}>Resolve Location</button>
          {locationResult && (
            <div className="result-card">
              <p><strong>City:</strong> {locationResult.city || 'Unknown'}</p>
              <p><strong>Region:</strong> {locationResult.region || 'Unknown'}</p>
            </div>
          )}
        </div>

        <div className={`step-card ${step === 3 ? 'active' : ''} ${verified ? '' : 'disabled'}`}>
          <h2>3. Upload photos</h2>
          <p>Select clear images of the damage for your estimate.</p>
          <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} />
          <div className="file-list">
            {images.map(file => (
              <span key={file.name} className="file-pill">{file.name}</span>
            ))}
          </div>
          <button disabled={!verified} onClick={handleEstimate}>Send for Estimate</button>
        </div>

        <div className={`step-card result-card-large ${step === 4 ? 'active' : ''}`}>
          <h2>4. Result</h2>
          {estimate ? (
            <div className="estimate-panel">
              <p className="badge success">Estimate ready</p>
              <p><strong>Damage found:</strong> {estimate.damage.join(', ')}</p>
              <p><strong>Estimated cost:</strong> {estimate.cost}</p>
            </div>
          ) : (
            <p>Submit images to receive an estimate.</p>
          )}
        </div>
      </div>

      <div className="message-bar">
        <span>{message}</span>
      </div>
    </div>
  );
}

export default App;
