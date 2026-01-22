# CPR Deadline Tracker - MERN Stack

A MERN stack application for tracking CPR deadlines.

## Tech Stack

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React** - Frontend framework (Vite)
- **Node.js** - Runtime environment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose (MongoDB ODM)
- cors (for React frontend communication)
- dotenv (for environment variables)
- nodemon (for development)

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/cpr-deadline-tracker
PORT=5000
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

### 4. Install React Dependencies

Navigate to the `client` folder and install React dependencies:

```bash
cd client
npm install
cd ..
```

### 5. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend server will start on `http://localhost:3000`

### 6. Start the React Frontend

Open a new terminal window and run:

```bash
cd client
npm run dev
```

The React app will start on `http://localhost:5173`

**To run both simultaneously**, you can:
- Open two terminal windows (one for backend, one for frontend)
- Or use a process manager like `concurrently` (see below)

## Project Structure

```
cpr-deadline-tracker/
├── app.js                 # Main Express server file
├── routes/
│   └── api.js            # API routes
├── models/               # MongoDB models (to be created)
├── controllers/          # Route controllers (to be created)
├── client/               # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css
│   │   ├── main.jsx      # React entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js    # Vite configuration
│   └── package.json
├── .env                  # Environment variables (create this)
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check

## Running Both Frontend and Backend Together

You can install `concurrently` to run both servers with one command:

```bash
npm install --save-dev concurrently
```

Then add this script to the root `package.json`:
```json
"dev:all": "concurrently \"npm run dev\" \"cd client && npm run dev\""
```

Run with:
```bash
npm run dev:all
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check

## Next Steps

1. Create MongoDB models in `models/` directory
2. Add authentication (JWT, Passport.js)
3. Implement CRUD operations for deadlines
4. Build out React components for deadline tracking
