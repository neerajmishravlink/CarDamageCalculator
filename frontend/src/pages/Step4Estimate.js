import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const USD_TO_INR = 83; // Exchange rate

function Step4Estimate({ token, estimate, uploadedImages }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Sample damage breakdown - in production this would come from the API
  const damageBreakdown = [
    { id: 1, type: 'Scratch', cost: 1200, icon: '🔨' },
    { id: 2, type: 'Dent', cost: 700, icon: '⚡' },
    { id: 3, type: 'Crack', cost: 3400, icon: '💥' },
    { id: 4, type: 'Broken Glass', cost: 2200, icon: '🪟' },
    { id: 5, type: 'Broken Lights', cost: 4200, icon: '💡' },
    { id: 6, type: 'Paint Damage', cost: 1600, icon: '🎨' },
  ];

  const toggleItemExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateTotalDamage = () => {
    return damageBreakdown.reduce((sum, item) => sum + item.cost, 0);
  };

  const convertToRupees = (usd) => {
    return Math.round(usd * USD_TO_INR);
  };

  const goToPreviousImage = () => {
    if (uploadedImages && uploadedImages.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? uploadedImages.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (uploadedImages && uploadedImages.length > 0) {
      setCurrentImageIndex(prev => 
        prev === uploadedImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const downloadReport = () => {
    try {
      const element = document.getElementById('report-content');
      if (!element) {
        alert('Report content not found. Please refresh and try again.');
        return;
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'damage-estimate-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch((error) => {
          console.error('PDF generation failed:', error);
          alert('Failed to generate PDF. Please try again.');
        });
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading report: ' + error.message);
    }
  };

  if (!token) {
    return (
      <div className="App">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">🚗 CarDamageCalculator</p>
            <h1>AI-Powered Damage Estimates</h1>
          </div>
          <div className="status-chip">📊 Step 4/4</div>
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

  if (!estimate) {
    return (
      <div className="App">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">🚗 CarDamageCalculator</p>
            <h1>AI-Powered Damage Estimates</h1>
            <p>Upload vehicle photos, verify your session, and get an instant damage assessment with accurate repair costs.</p>
          </div>
          <div className="status-chip">📊 Step 4/4</div>
        </div>

        <div className="workflow-grid">
          <div className="step-card active result-card-large">
            <h2>🎯 4. Your Estimate</h2>
            <p style={{color: '#6b7280', fontStyle: 'italic'}}>📤 No estimate yet. Please complete steps 1-3 first.</p>
            <button onClick={() => navigate('/step3')}>← Back to Step 3</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">🚗 CarDamageCalculator</p>
          <h1>AI-Powered Damage Estimates</h1>
          <p>Upload vehicle photos, verify your session, and get an instant damage assessment with accurate repair costs.</p>
        </div>
        <div className="status-chip">📊 Step 4/4</div>
      </div>

      <div className="estimate-full-container">
        {/* Left side - Uploaded Images with Navigation */}
        <div className="estimate-left-panel">
          <div className="step-card active">
            <h2>📸 4. Your Estimate</h2>
            <div className="estimate-panel">
              <p className="badge success">✓ Estimate ready</p>
              
              {/* Image Carousel */}
              <div className="image-carousel-section">
                <h3>📸 Uploaded Vehicle Images</h3>
                {uploadedImages && uploadedImages.length > 0 ? (
                  <div className="image-carousel-container">
                    <button 
                      className="carousel-nav-btn carousel-prev"
                      onClick={goToPreviousImage}
                      title="Previous image"
                    >
                      ◀ Prev
                    </button>
                    
                    <div className="carousel-image-wrapper">
                      <img 
                        src={URL.createObjectURL(uploadedImages[currentImageIndex])} 
                        alt={`Damage image ${currentImageIndex + 1}`}
                        className="carousel-image"
                      />
                      <div className="image-counter">
                        {currentImageIndex + 1} / {uploadedImages.length}
                      </div>
                    </div>
                    
                    <button 
                      className="carousel-nav-btn carousel-next"
                      onClick={goToNextImage}
                      title="Next image"
                    >
                      Next ▶
                    </button>
                  </div>
                ) : (
                  <div className="no-images-carousel">
                    <p className="no-images-icon">🖼️</p>
                    <p className="no-images-text">No images uploaded yet</p>
                    <button onClick={() => navigate('/step3')} className="secondary">← Upload Images</button>
                  </div>
                )}
                {uploadedImages && uploadedImages.length > 0 && (
                  <p className="carousel-image-name">{uploadedImages[currentImageIndex].name}</p>
                )}
              </div>

              {/* Interactive Damage Breakdown Table */}
              <div className="damage-details damage-breakdown">
                <h3>📋 Damage Classes & Repair Costs</h3>
                <div className="damage-table-container">
                  <table className="damage-table">
                    <thead>
                      <tr>
                        <th>Damage Class</th>
                        <th>Repair Cost (₹)</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {damageBreakdown.map((item, index) => (
                        <tr 
                          key={item.id}
                          className={`damage-row ${expandedItems[item.id] ? 'expanded' : ''}`}
                          onClick={() => toggleItemExpand(item.id)}
                          style={{animationDelay: `${index * 0.05}s`}}
                        >
                          <td className="damage-class">
                            <span className="damage-icon-cell">{item.icon}</span>
                            <span className="damage-type-name">{item.type}</span>
                          </td>
                          <td className="damage-cost">
                            <span className="cost-badge">₹{convertToRupees(item.cost).toLocaleString('en-IN')}</span>
                          </td>
                          <td className="damage-expand">
                            <button 
                              className="expand-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemExpand(item.id);
                              }}
                            >
                              {expandedItems[item.id] ? '▼' : '▶'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Expanded Details */}
                  {Object.keys(expandedItems).some(key => expandedItems[key]) && (
                    <div className="expanded-details-container">
                      {damageBreakdown.map(item => 
                        expandedItems[item.id] && (
                          <div key={`detail-${item.id}`} className="detail-card">
                            <div className="detail-header">
                              <span className="detail-icon">{item.icon}</span>
                              <span className="detail-title">{item.type}</span>
                            </div>
                            <p className="detail-text">
                              Professional assessment and repair for {item.type.toLowerCase()} damage including materials and labor.
                            </p>
                            <div className="detail-cost">Estimated Cost: <strong>₹{convertToRupees(item.cost).toLocaleString('en-IN')}</strong></div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="cost-summary">
                <div className="cost-row">
                  <span>Parts & Materials:</span>
                  <span className="cost-value">₹{convertToRupees(calculateTotalDamage() * 0.6).toLocaleString('en-IN')}</span>
                </div>
                <div className="cost-row">
                  <span>Labor Cost:</span>
                  <span className="cost-value">₹{convertToRupees(calculateTotalDamage() * 0.4).toLocaleString('en-IN')}</span>
                </div>
                <div className="cost-row total">
                  <span>💰 Total Estimate:</span>
                  <span className="total-value">₹{convertToRupees(calculateTotalDamage()).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <button onClick={() => navigate('/step1')} style={{flex: 1, minWidth: '120px'}}>🔄 Start Over</button>
                <button className="secondary" onClick={() => navigate('/step3')} style={{flex: 1, minWidth: '120px'}}>← Edit Photos</button>
                <button className="export-btn" onClick={downloadReport} style={{flex: 1, minWidth: '120px'}}>📥 Download Report</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Empty or for future use */}
        <div className="estimate-right-panel">
          {/* Placeholder for future enhancements */}
        </div>
      </div>

      {/* Hidden content for PDF export */}
      <div 
        id="report-content" 
        style={{
          position: 'absolute',
          left: '-10000px',
          top: '0',
          width: '210mm',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <div style={{padding: '30px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333'}}>
          {/* Header */}
          <div style={{borderBottom: '3px solid #1e40af', paddingBottom: '20px', marginBottom: '20px'}}>
            <h1 style={{margin: '0 0 10px 0', color: '#1e40af', fontSize: '24px', fontWeight: 'bold'}}>
              🚗 CAR DAMAGE ASSESSMENT REPORT
            </h1>
            <p style={{margin: '5px 0', fontSize: '11px', color: '#666'}}>Professional Vehicle Damage Estimate & Repair Quotation</p>
          </div>

          {/* Service Center Details */}
          <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px', borderLeft: '4px solid #1e40af'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div>
                <h3 style={{margin: '0 0 10px 0', color: '#1e40af', fontSize: '13px', fontWeight: 'bold'}}>SERVICE CENTER</h3>
                <p style={{margin: '5px 0', fontSize: '12px', fontWeight: 'bold'}}>🏢 Premier Auto Care Center</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}>📍 123 Service Lane, Auto Hub District</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}>📍 New York, NY 10001, USA</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}>📞 Phone: +1 (555) 123-4567</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}>✉️ Email: info@premierautocare.com</p>
              </div>
              <div>
                <h3 style={{margin: '0 0 10px 0', color: '#1e40af', fontSize: '13px', fontWeight: 'bold'}}>REPORT DETAILS</h3>
                <p style={{margin: '5px 0', fontSize: '11px'}}><strong>Report ID:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-IN', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}><strong>Time:</strong> {new Date().toLocaleTimeString('en-IN')}</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}><strong>Assessment Method:</strong> AI-Powered Visual Analysis</p>
                <p style={{margin: '5px 0', fontSize: '11px'}}><strong>Report Status:</strong> <span style={{color: '#16a34a', fontWeight: 'bold'}}>PRELIMINARY ESTIMATE</span></p>
              </div>
            </div>
          </div>

          {/* Damage Assessment Section */}
          <div style={{marginBottom: '25px'}}>
            <h2 style={{margin: '0 0 15px 0', color: '#1e40af', fontSize: '15px', fontWeight: 'bold', borderBottom: '2px solid #1e40af', paddingBottom: '8px'}}>
              📋 DAMAGE ASSESSMENT & REPAIR COSTS
            </h2>
            <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '15px'}}>
              <thead>
                <tr style={{backgroundColor: '#1e40af', color: 'white'}}>
                  <th style={{padding: '12px', textAlign: 'left', border: '1px solid #1e40af', fontSize: '12px', fontWeight: 'bold'}}>Damage Class</th>
                  <th style={{padding: '12px', textAlign: 'center', border: '1px solid #1e40af', fontSize: '12px', fontWeight: 'bold'}}>Severity</th>
                  <th style={{padding: '12px', textAlign: 'right', border: '1px solid #1e40af', fontSize: '12px', fontWeight: 'bold'}}>Repair Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {damageBreakdown.map((item, index) => (
                  <tr key={item.id} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa', borderBottom: '1px solid #ddd'}}>
                    <td style={{padding: '12px', border: '1px solid #ddd', fontSize: '11px'}}>{item.icon} {item.type}</td>
                    <td style={{padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '11px', fontWeight: 'bold', color: '#d97706'}}>High</td>
                    <td style={{padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontSize: '11px', fontWeight: 'bold', color: '#1e40af'}}>₹{convertToRupees(item.cost).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cost Breakdown Section */}
          <div style={{marginBottom: '25px', backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '5px', border: '1px solid #bfdbfe'}}>
            <h2 style={{margin: '0 0 15px 0', color: '#1e40af', fontSize: '15px', fontWeight: 'bold', borderBottom: '2px solid #1e40af', paddingBottom: '8px'}}>
              💰 COST BREAKDOWN
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px'}}>
              <div style={{backgroundColor: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #ddd'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666'}}>Parts & Materials Cost</p>
                <p style={{margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#16a34a'}}>
                  ₹{convertToRupees(calculateTotalDamage() * 0.6).toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{backgroundColor: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #ddd'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666'}}>Labour Cost</p>
                <p style={{margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#dc2626'}}>
                  ₹{convertToRupees(calculateTotalDamage() * 0.4).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div style={{backgroundColor: '#1e40af', color: 'white', padding: '15px', borderRadius: '4px', textAlign: 'center'}}>
              <p style={{margin: '0 0 8px 0', fontSize: '12px', opacity: '0.9'}}>TOTAL REPAIR ESTIMATE</p>
              <p style={{margin: '0', fontSize: '28px', fontWeight: 'bold'}}>
                ₹{convertToRupees(calculateTotalDamage()).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div style={{marginBottom: '25px'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <tbody>
                <tr style={{backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
                  <td style={{padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: '40%'}}>Total Repair Cost</td>
                  <td style={{padding: '12px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', color: '#1e40af'}}>₹{convertToRupees(calculateTotalDamage()).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{backgroundColor: 'white', borderBottom: '1px solid #ddd'}}>
                  <td style={{padding: '12px', fontSize: '12px', color: '#666'}}>Parts & Materials (60%)</td>
                  <td style={{padding: '12px', fontSize: '12px', textAlign: 'right', color: '#666'}}>₹{convertToRupees(calculateTotalDamage() * 0.6).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
                  <td style={{padding: '12px', fontSize: '12px', color: '#666'}}>Labour & Service (40%)</td>
                  <td style={{padding: '12px', fontSize: '12px', textAlign: 'right', color: '#666'}}>₹{convertToRupees(calculateTotalDamage() * 0.4).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions */}
          <div style={{backgroundColor: '#fef3c7', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #f59e0b'}}>
            <h3 style={{margin: '0 0 8px 0', color: '#92400e', fontSize: '12px', fontWeight: 'bold'}}>⚠️ IMPORTANT NOTES</h3>
            <ul style={{margin: '0', paddingLeft: '20px', fontSize: '11px', color: '#78350f'}}>
              <li style={{marginBottom: '5px'}}>This is a preliminary AI-generated estimate and may vary based on detailed inspection.</li>
              <li style={{marginBottom: '5px'}}>Final quotation will be confirmed after in-person inspection by our service technician.</li>
              <li style={{marginBottom: '5px'}}>Labor costs are estimated and may be adjusted based on actual repair complexity.</li>
              <li style={{marginBottom: '5px'}}>Parts availability and genuine OEM parts may affect final pricing.</li>
              <li style={{marginBottom: '5px'}}>This estimate is valid for 30 days from the date of generation.</li>
            </ul>
          </div>

          {/* Footer */}
          <div style={{borderTop: '2px solid #1e40af', paddingTop: '15px', textAlign: 'center', fontSize: '10px', color: '#666'}}>
            <p style={{margin: '5px 0'}}>
              <strong>Premier Auto Care Center</strong> | Professional Vehicle Repair & Maintenance
            </p>
            <p style={{margin: '5px 0'}}>
              📞 +1 (555) 123-4567 | ✉️ info@premierautocare.com | 🌐 www.premierautocare.com
            </p>
            <p style={{margin: '5px 0', color: '#999'}}>
              Generated by AI Damage Assessment System | Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p style={{margin: '5px 0', fontSize: '9px', color: '#ccc'}}>
              This is an automated report. For complete assessment, please contact our service center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step4Estimate;
