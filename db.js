const mongoose = require('mongoose');

// Define the MongoDB connection string
const mongoURI = process.env.MONGO_URI; // Replace with your MongoDB URI
console.log(mongoURI)

// Connect to MongoDB
const connectDB = async () => {
  try {
    const databaseName = 'bets';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: databaseName
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application if unable to connect
  }
};

module.exports = connectDB;
