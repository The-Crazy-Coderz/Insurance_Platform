import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

// Point to your backend
const API_URL = 'http://localhost:5000/api';

function App() {
    const [formData, setFormData] = useState({
        customerName: '',
        age: '',
        smoker: false,
        preExistingCondition: false,
        vehicleType: 'Sedan',
        productType: 'Motor',
        yearsNoClaims: 0,
        existingCustomer: false
    });
    
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setQuote(null);
        
        try {
            const response = await axios.post(`${API_URL}/calculate-quote`, formData);
            setQuote(response.data.quote);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    
    const getDecisionBadge = (decision) => {
        if (decision === 'AUTO_APPROVED') {
            return <span className="badge approved">✅ AUTO APPROVED</span>;
        } else if (decision === 'NEEDS_UNDERWRITING_REVIEW') {
            return <span className="badge review">⚠️ NEEDS REVIEW</span>;
        }
        return <span className="badge rejected">❌ AUTO REJECTED</span>;
    };
    
    return (
        <div className="container">
            <header>
                <h1>🏢 Insurance Underwriting Platform</h1>
                <p>Rule-based decision engine | No AI - Pure Business Logic</p>
            </header>
            
            <div className="main-grid">
                <div className="form-section">
                    <h2>Customer Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Age *</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="18"
                                max="100"
                            />
                        </div>
                        
                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="smoker"
                                    checked={formData.smoker}
                                    onChange={handleChange}
                                />
                                Smoker?
                            </label>
                        </div>
                        
                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="preExistingCondition"
                                    checked={formData.preExistingCondition}
                                    onChange={handleChange}
                                />
                                Pre-existing medical condition?
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>Product Type *</label>
                            <select name="productType" value={formData.productType} onChange={handleChange}>
                                <option value="Health">Health Insurance</option>
                                <option value="Motor">Motor Insurance</option>
                                <option value="Life">Life Insurance</option>
                                <option value="Property">Property Insurance</option>
                            </select>
                        </div>
                        
                        {formData.productType === 'Motor' && (
                            <div className="form-group">
                                <label>Vehicle Type</label>
                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Sports Car">Sports Car</option>
                                    <option value="Truck">Truck</option>
                                </select>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>Years without claims</label>
                            <input
                                type="number"
                                name="yearsNoClaims"
                                value={formData.yearsNoClaims}
                                onChange={handleChange}
                                min="0"
                                max="20"
                            />
                        </div>
                        
                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="existingCustomer"
                                    checked={formData.existingCustomer}
                                    onChange={handleChange}
                                />
                                Existing customer?
                            </label>
                        </div>
                        
                        <button type="submit" disabled={loading}>
                            {loading ? 'Calculating...' : '💰 Get Quote'}
                        </button>
                    </form>
                </div>
                
                <div className="result-section">
                    {error && (
                        <div className="error">
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {quote && (
                        <div className="quote-result">
                            <h2>Quote Result</h2>
                            <div className="quote-id">
                                Quote ID: {quote.quoteId}
                            </div>
                            
                            <div className="premium">
                                <span className="label">Premium Amount</span>
                                <span className="amount">${quote.finalPremium}/year</span>
                            </div>
                            
                            <div className="decision">
                                {getDecisionBadge(quote.decision)}
                            </div>
                            
                            <div className="breakdown">
                                <h3>Premium Breakdown</h3>
                                <div className="breakdown-item">
                                    <span>Base Premium:</span>
                                    <span>${quote.breakdown.basePremium}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span>Risk Adjustment:</span>
                                    <span>+${quote.breakdown.riskAdjustment}</span>
                                </div>
                                {quote.discountPercentage > 0 && (
                                    <div className="breakdown-item discount">
                                        <span>Discount Applied:</span>
                                        <span>-${Math.round(quote.breakdown.discountApplied)} ({quote.discountPercentage}%)</span>
                                    </div>
                                )}
                                <div className="breakdown-item total">
                                    <span>Total Premium:</span>
                                    <span>${quote.finalPremium}</span>
                                </div>
                            </div>
                            
                            <div className="rules-applied">
                                <h3>Rules Applied ({quote.appliedRules.length})</h3>
                                <ul>
                                    {quote.appliedRules.map((rule, idx) => (
                                        <li key={idx}>
                                            <strong>{rule.ruleId}:</strong> {rule.reason}
                                            <span className="impact">Impact: {rule.impact}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;