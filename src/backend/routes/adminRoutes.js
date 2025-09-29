const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
// All routes require authentication and admin role
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin', 'super_admin'));
// Dashboard
router.get('/dashboard', adminController.getDashboardStats);
// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:role/:id/toggle-status', adminController.toggleUserStatus);
router.put('/users/:role/:id/verify', adminController.verifyUser);
// Admin management (super_admin only)
router.post('/create-admin', adminController.createAdmin);
module.exports = router;