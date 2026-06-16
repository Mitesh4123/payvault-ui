# PayVault UI

React frontend for the [PayVault API](https://github.com/Mitesh4123/payvault) — a digital wallet and payment system.

🔗 **Live App:** (add Vercel URL here after deploy)  
🔗 **Backend API:** https://payvault-api-r02m.onrender.com

---

## Features

- Register / Login with JWT auth
- Dashboard with live wallet balance
- Deposit, Withdraw, Transfer funds
- OTP verification for large transfers (above ₹1000)
- Full transaction history with type filters and pagination
- Auto token refresh on expiry

## Tech Stack

React · Vite · React Router · Axios · Plain CSS

## Getting Started

```bash
git clone https://github.com/Mitesh4123/payvault-ui.git
cd payvault-ui
npm install

cp .env.example .env
# Set VITE_API_URL to your backend URL

npm run dev
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

## Author

**Mitesh Thummar** — [GitHub](https://github.com/Mitesh4123) · [LinkedIn](https://linkedin.com/in/miteshthummar)
