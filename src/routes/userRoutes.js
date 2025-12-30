const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  getAllUsers,
  activateUser,
  deactivateUser,
  getProfile,
  updateProfile  // <-- make sure this exists in userController.js
} = require('../controllers/userController');

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);  // <-- this must exist

// Admin routes
router.get('/', auth, role('admin'), getAllUsers);
router.put('/activate/:id', auth, role('admin'), activateUser);
router.put('/deactivate/:id', auth, role('admin'), deactivateUser);

module.exports = router;
