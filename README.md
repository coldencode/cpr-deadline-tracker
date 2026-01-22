# CPR Deadline Tracker - MERN Stack

A MERN stack application for tracking CPR deadlines with a flowchart-based date calculator.

## Tech Stack

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React** - Frontend framework (Vite)
- **Node.js** - Runtime environment

## Local Development

### 1. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/cpr-deadline-tracker
PORT=3000
NODE_ENV=development
```

**For MongoDB Atlas (cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cpr-deadline-tracker
```

### 3. Start MongoDB

**Option A: Local MongoDB**
Make sure MongoDB is running on your machine:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

**Option B: MongoDB Atlas**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string and add it to `.env`

### 4. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend server will start on `http://localhost:3000`

### 5. Start the React Frontend

Open a new terminal window and run:

```bash
cd frontend
npm run dev
```

The React app will start on `http://localhost:5173`

**To run both simultaneously**, you can:
- Open two terminal windows (one for backend, one for frontend)
- Or use a process manager like `concurrently` (see below)

## Running Both Frontend and Backend Together

You can install `concurrently` to run both servers with one command:

```bash
npm install --save-dev concurrently
```

Then add this script to the root `package.json`:
```json
"dev:all": "concurrently \"npm run dev\" \"cd frontend && npm run dev\""
```

Run with:
```bash
npm run dev:all
```

## Project Structure

```
cpr-deadline-tracker/
├── api/
│   └── index.js              # Vercel serverless function wrapper
├── app.js                     # Main Express server file
├── routes/
│   └── api.js                 # API routes
├── utils/
│   └── dateCalculations.js   # Backend date calculation logic
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/            # Frontend utilities (formatting)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env                       # Environment variables (create this)
├── vercel.json                # Vercel deployment configuration
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Welcome message
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

### Environment Variables on Vercel

Make sure to set these in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production`

You can set them via:
- Vercel Dashboard → Project Settings → Environment Variables
- Or CLI: `vercel env add MONGODB_URI`

### How It Works

- **Frontend**: Built with Vite and served as static files
- **Backend**: Express API runs as Vercel serverless functions
- **Routing**: Vercel rewrites handle API routes and SPA routing

## Features

- ✅ Flowchart-based deadline calculator
- ✅ Conditional question flow
- ✅ Real-time deadline calculation
- ✅ Backend API for calculations
- ✅ Modern, responsive UI
- ✅ Vercel-ready deployment

## Next Steps

1. Add MongoDB models for storing calculation history
2. Add authentication (JWT, Passport.js)
3. Implement CRUD operations for deadline tracking
4. Add user accounts and saved calculations
