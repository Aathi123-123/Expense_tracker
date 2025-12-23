const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try connecting to the provided URI first (e.g. local MongoDB)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fail fast if not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not found, starting in-memory MongoDB...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('NOTE: Data will be lost when the server restarts. Install MongoDB locally for persistence.');
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
