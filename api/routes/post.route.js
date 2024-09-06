import express from 'express'
import { verifyToken } from '../utils/verify.js'
import { create, getposts, deletepost, updatepost, likePost, useAi } from '../controllers/post.controller.js';
 
const router = express.Router();

router.post('/create',verifyToken, create); 
router.get('/getposts', getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
router.put('/likepost/:postId',verifyToken, likePost);
router.get('/useAi/:question',verifyToken,useAi);
export default router  