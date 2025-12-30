exports.getAllUsers = async (req, res) => { /* ... */ };
exports.activateUser = async (req, res) => { /* ... */ };
exports.deactivateUser = async (req, res) => { /* ... */ };
exports.getProfile = async (req, res) => { /* ... */ };
exports.updateProfile = async (req, res) => { 
    // Example:
    const user = req.user;
    const { fullName, email, phone } = req.body;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ message: "Profile updated", user });
};
// controllers/userController.js
const User = require('../models/User');

// GET ALL USERS - admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('fullName email password role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const { fullName, email, phone, password, newPassword } = req.body;

    if (password && !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
