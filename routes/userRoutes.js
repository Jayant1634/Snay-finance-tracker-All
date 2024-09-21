const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path to your User model

// Password hashing function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// User Registration
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body; // Include name

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create a new user with name
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Get username and password from request body
  console.log("Attempting to log in with:", username, password);


  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If everything is okay, send user data (omit password)
    res.status(200).json({ id: user._id, username: user.username }); // Adjust this based on what you want to return
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Balance
router.post('/updateBalance', async (req, res) => {
  const { userId, amount } = req.body; // Expecting userId and amount in the request body

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.currentBalance += amount; // Update current balance
    await user.save(); // Save the updated user

    res.status(200).json({ currentBalance: user.currentBalance }); // Return updated balance
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
