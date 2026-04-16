import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

// Login
router.post('/login', authController.login);

// Check auth status
router.get('/status', authController.status);

// Verify token
router.get('/verify', authController.verify);

export default router;
