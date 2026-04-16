const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
   const token = jwt.sign(
    { id: user._id, role: user.role, base: user.base },
    process.env.JWT_SECRET, {expiresIn: process.env.JWT_SECRET_EXPIRE}
  );
   console.log('🔑 Token generated for user:', user._id);
   return token;
}

exports.register = async (req, res) => {
  try {
    console.log('📝 Register endpoint called with:', { name: req.body.name, email: req.body.email, role: req.body.role, base: req.body.base });
    const { name, email, password, role, base } = req.body;

    if (!name || !email || !password || !role || !base) {
      console.log('✗ Registration failed - Missing fields:', { name: !!name, email: !!email, password: !!password, role: !!role, base: !!base });
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      base
    });
    
    const token = generateToken(user);
    console.log('✓ User registered successfully:', { userId: user._id, email: user.email, role: user.role });
    res.status(201).json({ message: "User registered", user, token });
  } catch (error) {
    console.log('✗ Registration error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔑 Login endpoint called with email:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('✗ Login failed - Missing email or password');
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('✗ User not found:', email);
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('✗ Invalid password for user:', email);
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    console.log('✓ Login successful for user:', { userId: user._id, email: user.email, role: user.role });
    res.json({ token, user });
  } catch (error) {
    console.log('✗ Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};