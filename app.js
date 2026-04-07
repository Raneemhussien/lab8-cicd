const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB connection string comes from environment variable
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tasksdb';

// Define a simple Task schema
const taskSchema = new mongoose.Schema({
  id:     Number,
  name:   String,
  status: String
});

const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB, retrying every 3 seconds until it succeeds
function connectWithRetry() {
  mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection failed, retrying in 3s...', err.message);
      setTimeout(connectWithRetry, 3000);
    });
}

connectWithRetry();

// Route: return all tasks as JSON
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({}, { _id: 0, __v: 0 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});