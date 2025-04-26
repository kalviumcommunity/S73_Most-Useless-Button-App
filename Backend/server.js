require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add JWT
const User = require('./schema');
const cors = require('cors');
const ButtonStat = require("./TimeSchema")

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
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Create the default button stats for the new user
    const buttonStats = new ButtonStat({
      userId: user._id,      // Link button stats to the user by their ID
      clicks: 0,             // Initial button stats with 0 clicks
      wastedTime: 0,         // Initial button stats with 0 wasted time
      created_by: user._id,  // Required field: reference to the user creating the stats
    });


    // Save the button stats to the database
    await buttonStats.save();

    // Generate JWT token for the new user
    const token = generateToken(user);

    // Respond with the JWT token
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


app.get('/button-stats', verifyToken, async (req, res) => {
  try {
    const buttonStat = await ButtonStat.findOne({ created_by: req.user.userId });

    if (!buttonStat) {
      return res.status(404).json({ message: "Button stats not found" });
    }

    res.json(buttonStat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/button-stats', verifyToken, async (req, res) => {
  const { clicks, wastedTime } = req.body;

  try {
    // Check if ButtonStat exists for the logged-in user
    let buttonStat = await ButtonStat.findOne({ created_by: req.user.userId });

    // If ButtonStat doesn't exist, create a new one
    if (!buttonStat) {
      buttonStat = new ButtonStat({
        created_by: req.user.userId,
        clicks: clicks || 0,
        wastedTime: wastedTime || 0,
      });

      await buttonStat.save();
    } else {
      // If it exists, update the existing ButtonStat (increment clicks/wastedTime)
      buttonStat.clicks += clicks || 0;
      buttonStat.wastedTime += wastedTime || 0;

      await buttonStat.save();
    }

    // Return the updated buttonStat
    res.json(buttonStat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/getAllUsersWithButtonStats", async (req, res) => {
  try {
    const buttonStats = await ButtonStat.find()
      .populate("created_by", "username") // <<<<<< Correct field here
      .lean();

    const userMap = {};

    buttonStats.forEach((stat) => {
      const userId = stat.created_by._id.toString();
      if (!userMap[userId]) {
        userMap[userId] = {
          _id: userId,
          username: stat.created_by.username,
          buttonStats: [],
        };
      }
      userMap[userId].buttonStats.push(stat);
    });

    res.json(Object.values(userMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
