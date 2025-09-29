const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected routes
router.get('/me', authMiddleware.protect, authController.getCurrentUser);
router.put('/change-password', authMiddleware.protect, authController.changePassword);
module.exports = router;