const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const Expense = require('./models/Expense');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// Seed Endpoint for testing
app.get('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword
    });

    // Create Sample Expenses
    await Expense.create([
      { user: user._id, title: 'Welcome Coffee', amount: 50.00, category: 'Food', date: new Date(), notes: 'First expense!' },
      { user: user._id, title: 'Project Setup', amount: 1200.00, category: 'Work', date: new Date(), notes: 'Hosting fees' },
      { user: user._id, title: 'Groceries', amount: 450.00, category: 'Food', date: new Date(Date.now() - 86400000) } // Yesterday
    ]);

    res.json({ 
      message: 'Database seeded successfully!', 
      credentials: { email: 'demo@example.com', password: '123456' } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug Endpoint to view full DB
app.get('/api/debug/db', async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords for security
    const expenses = await Expense.find({});
    
    const dbState = {
      timestamp: new Date(),
      counts: {
        users: users.length,
        expenses: expenses.length
      },
      users,
      expenses
    };
    
    // Log to backend terminal
    console.log('--- Database Dump ---');
    console.log(`Users: ${users.length}, Expenses: ${expenses.length}`);
    
    res.json(dbState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
