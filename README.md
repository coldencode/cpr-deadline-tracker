# CPR Deadline Tracker

A single-page application for calculating CPR deadlines with a flowchart-based date calculator using React and Vercel serverless functions.

## Tech Stack

- **React** - Frontend framework (Vite)
- **Vercel Serverless Functions** - Backend API
- **Node.js** - Runtime environment

## Local Development

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Run Locally

Start the development server:

```bash
vercel dev
```

Or use the npm script:

```bash
npm run dev:local
```

This will:
- Start Vercel's local dev server
- Serve your React frontend
- Run your serverless functions at `/api/calculate-deadline`
- Usually runs on `http://localhost:3000`

**First time setup:** When you run `vercel dev` for the first time, you can skip linking to a Vercel project for local development.

### Alternative: Frontend Only

If you just want to test the UI (API calls will fail):

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:5173`

## Project Structure

```
cpr-deadline-tracker/
├── api/
│   ├── calculate-deadline.js  # Serverless function for deadline calculation
│   └── health.js               # Health check endpoint
├── utils/
│   └── dateCalculations.js   # Date calculation logic
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/            # Frontend utilities (formatting)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── vercel.json                # Vercel deployment configuration
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/calculate-deadline` - Calculate deadline based on flowchart logic

## Deployment to Vercel

### One-Command Deployment

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

Or for production:
```bash
vercel --prod
```

### How It Works

- **Frontend**: Built with Vite and served as static files
- **Backend**: Serverless functions handle API requests
- **Routing**: Vercel rewrites handle API routes and SPA routing

## Features

- ✅ Flowchart-based deadline calculator
- ✅ Conditional question flow
- ✅ Real-time deadline calculation via serverless functions
- ✅ Backend API for calculations
- ✅ Modern, responsive UI
- ✅ Vercel-ready deployment

## Next Steps

1. Add database for storing calculation history (if needed)
2. Add authentication (if user accounts are needed)
3. Add saved calculations feature
4. Export/print functionality
