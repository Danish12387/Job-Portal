import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createPost } from '../controllers/post.controller';

const router = express.Router();

router.route('/create-post').post(isAuthenticated, createPost);

export default router;