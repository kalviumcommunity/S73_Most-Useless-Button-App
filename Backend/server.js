require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add JWT
const User = require('./schema');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check if necessary environment variables are set
if (!process.env.MONGO_URI || !process.env.PORT || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables: MONGO_URI, PORT, or JWT_SECRET");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration
  });
};

// Add new user (Registration)
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields (username, email, password) are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    const token = generateToken(user); // Generate JWT token for new user
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route (with JWT generation)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user); // Generate JWT token on successful login
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware for protected routes (verify JWT)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    console.log('Token verified, user:', req.user);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


// Get current logged-in user's details
app.get('/users/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Get user based on JWT userId
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Inside your PUT route
app.put('/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is being updated, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Delete user (protected route)
app.delete('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  if (req.user.userId !== userId) {
    return res.status(403).json({ message: "Not authorized to delete this user" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
