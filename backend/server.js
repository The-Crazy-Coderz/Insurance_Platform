const express = require('express');
const cors = require('cors');
const { calculatePremium, RULES } = require('./rules-engine');

const app = express();
app.use(cors());
app.use(express.json());

const quotes = [];
let quoteCounter = 1;

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Insurance platform running' });
});

app.get('/api/rules', (req, res) => {
    res.json({
        rules: RULES.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description
        })),
        totalRules: RULES.length
    });
});

app.post('/api/calculate-quote', (req, res) => {
    const {
        customerName,
        age,
        smoker,
        preExistingCondition,
        vehicleType,
        productType,
        yearsNoClaims,
        existingCustomer
    } = req.body;
    
    if (!age || !productType) {
        return res.status(400).json({ 
            error: 'Missing required fields: age and productType are mandatory' 
        });
    }
    
    const customerData = {
        age: parseInt(age),
        smoker: smoker === true || smoker === 'true',
        preExistingCondition: preExistingCondition === true || preExistingCondition === 'true',
        vehicleType: vehicleType || 'Sedan',
        yearsNoClaims: yearsNoClaims || 0,
        existingCustomer: existingCustomer === true || existingCustomer === 'true'
    };
    
    const result = calculatePremium(customerData, productType);
    
    const quote = {
        quoteId: `QTE-${Date.now()}-${quoteCounter++}`,
        customerName: customerName || 'Anonymous',
        customerData,
        productType,
        calculatedAt: new Date().toISOString(),
        ...result
    };
    
    quotes.unshift(quote);
    
    res.json({
        success: true,
        quote
    });
});

app.get('/api/quotes', (req, res) => {
    res.json({
        totalQuotes: quotes.length,
        quotes: quotes.slice(0, 50)
    });
});

app.get('/api/quotes/:quoteId', (req, res) => {
    const quote = quotes.find(q => q.quoteId === req.params.quoteId);
    if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
    }
    res.json({ quote });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Insurance Platform Backend running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/rules  - List all rules`);
    console.log(`   POST /api/calculate-quote - Calculate premium`);
    console.log(`   GET  /api/quotes - View all quotes`);
});