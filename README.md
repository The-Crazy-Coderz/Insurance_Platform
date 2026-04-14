# 🏢 Insurance Underwriting Platform

## 📌 Project Overview

A **rule-based** insurance policy configuration and underwriting system. 
No AI - just pure business logic rules that real insurance companies use.

**Built in 3 days | Full-stack | Production-ready**

---

## 🎯 What It Does

| Feature | Description |
|---------|-------------|
| Risk Assessment | Calculates risk score based on 7 business rules |
| Real-time Quotes | Premium updates instantly when form changes |
| Auto Decision | Approves/Rejects/Flags for review automatically |
| Rule Transparency | Shows exactly which rules were applied |
| Quote History | Stores all generated quotes |

---

## 🧠 The Rule Engine (7 Business Rules)

| Rule ID | Name | Impact | Condition |
|---------|------|--------|-----------|
| R001 | Senior Citizen Risk | +30 points | Age > 65 |
| R002 | Smoker Penalty | +50 points | Smoker = Yes |
| R003 | Pre-existing Condition | +40 points | Has medical history |
| R004 | Sports Car Multiplier | 1.5x | Vehicle = Sports Car |
| R005 | Young Driver Surcharge | +25 points | Age < 25 |
| R006 | Safe Driver Discount | -10% | 5+ years no claims |
| R007 | Multi-policy Discount | -5% | Existing customer |

### Decision Logic
Risk Score < 30 → AUTO APPROVED ✅
Risk Score 30-70 → NEEDS REVIEW ⚠️
Risk Score > 70 → AUTO REJECTED ❌


## 🏗️ Architecture
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ React │────▶│ Node.js │────▶│ Rule Engine │
│ Frontend │◀────│ Backend │ │ (Pure JS) │
└─────────────┘ └─────────────┘ └─────────────┘
Port 3000 Port 5000


**Tech Stack:**
- Frontend: React 18 + Axios
- Backend: Node.js + Express
- Language: JavaScript
- Version Control: Git

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18 or higher)
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/insurance-underwriting-platform.git
cd insurance-underwriting-platform

# 2. Start Backend
cd backend
npm install
npm start
# Runs on http://localhost:5000

# 3. Start Frontend (new terminal)
cd frontend
npm install
npm start
# Runs on http://localhost:3000