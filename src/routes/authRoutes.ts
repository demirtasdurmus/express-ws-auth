import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkAuthController, loginController, logoutController } from '../controllers/authControllers';
const router = Router();

router.post('/login', loginController);
router.post('/check-auth', authMiddleware, checkAuthController);
router.delete('/logout', logoutController);

export { router as authRoutes };
