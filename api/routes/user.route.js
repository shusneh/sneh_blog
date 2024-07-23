import express from 'express'
const router = express.Router();
import {test, updateUser} from '../controllers/user.controller.js'
import {verifyToken} from '../utils/verify.js';
router.get('/test',test);
router.put('/update/:userId', verifyToken, updateUser);

export default router;