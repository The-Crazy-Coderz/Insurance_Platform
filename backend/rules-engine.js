/**
 * INSURANCE RULE ENGINE
 * All business rules are defined here - no AI, just pure logic
 */

const RULES = [
    {
        id: 'R001',
        name: 'Senior Citizen Risk Adjustment',
        description: 'Customers above 65 years have higher health risk',
        condition: (data) => data.age > 65,
        action: (context) => {
            context.riskScore += 30;
            context.appliedRules.push({
                ruleId: 'R001',
                impact: 30,
                reason: 'Age > 65 increases mortality risk'
            });
        }
    },
    {
        id: 'R002',
        name: 'Smoker Penalty',
        description: 'Smokers have significantly higher health risks',
        condition: (data) => data.smoker === true,
        action: (context) => {
            context.riskScore += 50;
            context.appliedRules.push({
                ruleId: 'R002',
                impact: 50,
                reason: 'Smoking increases probability of claims by 40%'
            });
        }
    },
    {
        id: 'R003',
        name: 'Pre-existing Condition Surcharge',
        description: 'Pre-existing medical conditions increase risk',
        condition: (data) => data.preExistingCondition === true,
        action: (context) => {
            context.riskScore += 40;
            context.appliedRules.push({
                ruleId: 'R003',
                impact: 40,
                reason: 'Pre-existing conditions lead to higher claim frequency'
            });
        }
    },
    {
        id: 'R004',
        name: 'Sports Car Multiplier',
        description: 'Sports cars have higher accident probability',
        condition: (data) => data.vehicleType === 'Sports Car',
        action: (context) => {
            context.riskMultiplier = (context.riskMultiplier || 1) * 1.5;
            context.appliedRules.push({
                ruleId: 'R004',
                impact: '1.5x',
                reason: 'Sports cars statistically have 50% more accidents'
            });
        }
    },
    {
        id: 'R005',
        name: 'Young Driver Surcharge',
        description: 'Drivers under 25 have higher accident rates',
        condition: (data) => data.age < 25 && data.vehicleType === 'Motor',
        action: (context) => {
            context.riskScore += 25;
            context.appliedRules.push({
                ruleId: 'R005',
                impact: 25,
                reason: 'Young drivers have higher accident rates'
            });
        }
    },
    {
        id: 'R006',
        name: 'Safe Driver Discount',
        description: 'No claims in last 5 years',
        condition: (data) => data.yearsNoClaims >= 5,
        action: (context) => {
            context.discount = (context.discount || 0) + 0.10;
            context.appliedRules.push({
                ruleId: 'R006',
                impact: '-10%',
                reason: '5+ years without claims demonstrates safe driving'
            });
        }
    },
    {
        id: 'R007',
        name: 'Multi-policy Discount',
        description: 'Customer has existing policies with us',
        condition: (data) => data.existingCustomer === true,
        action: (context) => {
            context.discount = (context.discount || 0) + 0.05;
            context.appliedRules.push({
                ruleId: 'R007',
                impact: '-5%',
                reason: 'Loyalty discount for existing customers'
            });
        }
    }
];

const BASE_PREMIUM = {
    Health: 500,
    Motor: 400,
    Life: 300,
    Property: 600
};

function calculateRiskScore(customerData) {
    const context = {
        riskScore: 0,
        riskMultiplier: 1,
        discount: 0,
        appliedRules: []
    };
    
    for (const rule of RULES) {
        if (rule.condition(customerData)) {
            rule.action(context);
        }
    }
    
    return context;
}

function calculatePremium(customerData, productType) {
    const basePremium = BASE_PREMIUM[productType] || 500;
    const riskContext = calculateRiskScore(customerData);
    
    let premium = basePremium + (riskContext.riskScore * 10);
    premium = premium * riskContext.riskMultiplier;
    
    const discountAmount = premium * riskContext.discount;
    premium = premium - discountAmount;
    
    let decision;
    if (riskContext.riskScore < 30) {
        decision = 'AUTO_APPROVED';
    } else if (riskContext.riskScore <= 70) {
        decision = 'NEEDS_UNDERWRITING_REVIEW';
    } else {
        decision = 'AUTO_REJECTED';
    }
    
    return {
        finalPremium: Math.round(premium),
        riskScore: riskContext.riskScore,
        riskMultiplier: riskContext.riskMultiplier,
        discountPercentage: (riskContext.discount * 100),
        decision,
        appliedRules: riskContext.appliedRules,
        breakdown: {
            basePremium,
            riskAdjustment: riskContext.riskScore * 10,
            multiplierEffect: premium - (basePremium + (riskContext.riskScore * 10)),
            discountApplied: discountAmount
        }
    };
}

module.exports = { calculatePremium, RULES, BASE_PREMIUM };