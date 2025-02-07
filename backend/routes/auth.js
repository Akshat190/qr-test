const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Add this line to import the authMiddleware
const authMiddleware = require('../middleware/authMiddleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PasswordReset = require('../models/PasswordReset');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, restaurantName } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate restaurant name for owners
    if (role === 'owner' && !restaurantName) {
      return res.status(400).json({ message: 'Restaurant name is required for owners' });
    }

    // Create new user
    const newUser = new User({ 
      email, 
      password, 
      role,
      restaurantName: role === 'owner' ? restaurantName : undefined 
    });
    await newUser.save();

    // Generate JWT token with user._id as restaurantId
    const token = jwt.sign(
      { 
        id: newUser._id,  // User ID
        role: newUser.role,
        restaurantId: newUser._id  // Same as User ID for owners
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role,
        restaurantName: newUser.restaurantName 
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        restaurantId: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Login successful
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    console.log('Received forgot password request:', req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Save token to database
    await PasswordReset.create({
      userId: user._id,
      token: token
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log('Reset URL:', resetLink);
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
      `
    });

    console.log('Email sent successfully');
    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Error in password reset request', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const passwordReset = await PasswordReset.findOne({ token });
    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(passwordReset.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete used token
    await PasswordReset.deleteOne({ _id: passwordReset._id });

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

module.exports = router;
