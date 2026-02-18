import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  login,
  getLeads,
  updateStatus,
  logout
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.get('/leads', authMiddleware, getLeads);
router.put('/leads/:id', authMiddleware, updateStatus);
router.post('/logout', logout);

export default router;

