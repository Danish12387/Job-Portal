import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createPost, getAllPost, likePostHandler } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.js';
const router = express.Router();
router.route('/create-post').post(isAuthenticated, upload.single('image'), createPost);
router.route('/get-all-posts').get(isAuthenticated, getAllPost);
router.route('/:id/likeDislike').get(isAuthenticated, likePostHandler);
export default router;
