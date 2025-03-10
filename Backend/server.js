require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./schema'); 
const cors = require("cors");


const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected';
  res.json({ dbStatus });
});


app.get("/users/get", async (req, res) => {
  try {
    const entities = await User.find(); 
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch entities" });
  }
});


app.post('/users', async (req, res) => {
  console.log("Received data:", req.body); 
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});



app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
