import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Step1Auth({ token, setToken, onTokenVerified }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('✨ Enter your email to verify your session.');
  const navigate = useNavigate();

  const handleSendLink = async () => {
    if (!email) return setMessage('📧 Please enter an email address.');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.magic_token || '');
        setMessage('✅ Magic link generated! Check the token field below.');
      } else {
        setMessage('❌ ' + (data.detail || 'Unable to request magic link.'));
      }
    } catch (error) {
      setMessage('⚠️ Unable to reach the backend. Is the API running?');
    }
  };

  const handleVerify = async () => {
    if (!token) return setMessage('🔑 Please paste a token or generate one.');
    try {
      const params = new URLSearchParams({ token });
      const res = await fetch(`${API_BASE_URL}/auth/verify?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Session verified! Moving to location setup...');
        setToken(data.access_token);
        onTokenVerified(data.access_token);
        setTimeout(() => navigate('/step2'), 500);
      } else {
        setMessage('❌ ' + (data.detail || 'Verification failed.'));
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
        <div className="status-chip">📊 Step 1/4</div>
      </div>

      <div className="workflow-grid">
        <div className="step-card active">
          <h2>🔐 1. Request access</h2>
          <p>Enter your email to receive a secure magic link for authentication.</p>
          
          <div className="auth-section">
            <h3>Step 1: Request Magic Link</h3>
            <label>📧 Email Address</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                type="email" 
                style={{flex: 1}} 
              />
              <button onClick={handleSendLink} style={{flex: 0}}>🚀 Request</button>
            </div>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-section">
            <h3>Step 2: Verify Token</h3>
            <label>🔑 Token / JWT</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                value={token} 
                onChange={e => setToken(e.target.value)} 
                placeholder="Paste JWT or magic token" 
                style={{flex: 1}} 
              />
              <button className="secondary" onClick={handleVerify} style={{flex: 0}}>✓ Verify</button>
            </div>
          </div>
        </div>
      </div>

      <div className="message-bar">
        {message}
      </div>
    </div>
  );
}

export default Step1Auth;
