const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed, role: role || 'user' });

    res.status(201).json({
      message: 'User registered',
      token: generateToken(user._id),
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
