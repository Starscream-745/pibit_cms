import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// All user management routes require authentication and admin role
router.use('/users', authenticate, requireAdmin);

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
