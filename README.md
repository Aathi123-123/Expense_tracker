# Save Karo - Expense Tracker

A full-stack expense tracker application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Dashboard**: Overview of monthly spending and budget status.
- **Weekly View**: Track expenses week-by-week with a visual bar chart.
- **Calendar View**: Daily breakdown of expenses with an interactive pie chart.
- **Authentication**: Secure login and registration (Guest mode available).
- **Responsive Design**: Works on desktop and mobile.

## Prerequisites
- Node.js installed on your machine.
- MongoDB (Optional: The app uses an in-memory database if MongoDB is not found).

## How to Run

You need to run the **Backend** and **Frontend** in separate terminals.

### 1. Start the Backend
The backend runs on port `5001`.

```bash
cd backend
npm install  # Install dependencies (first time only)
npm run dev
```

### 2. Start the Frontend
The frontend runs on port `5173`.

```bash
cd frontend
npm install  # Install dependencies (first time only)
npm run dev
```

### 3. Open the App
Open your browser and go to:
**http://localhost:5173**

## Demo Credentials
To see sample data, log in with:
- **Email:** `demo@example.com`
- **Password:** `123456`

## Deployment

Since this is a full-stack application with a Node.js backend, you cannot host it on GitHub Pages (which only supports static sites).

### Recommended Hosting (Free)
We recommend using **Render.com** or **Railway.app** to host both the backend and frontend.

1. **Push your code to GitHub.**
2. **Create a Web Service on Render:**
   - Connect your GitHub repository.
   - **Build Command:** `npm install && cd frontend && npm install && npm run build`
   - **Start Command:** `node backend/server.js`
   - Add Environment Variables (e.g., `MONGO_URI`, `JWT_SECRET`).

### Deploying Frontend to Vercel
You can host the **Frontend** on Vercel for free.

1. **Push your code to GitHub.**
2. **Go to Vercel.com** and "Add New Project".
3. **Import** your GitHub repository.
4. **Configure Project:**
   - **Root Directory:** Click "Edit" and select `frontend`.
   - **Environment Variables:** Add `VITE_API_URL` and set it to your deployed backend URL (e.g., `https://your-backend.onrender.com`).
5. **Deploy.**

*Note: You still need to host the Backend separately (e.g., on Render).*
