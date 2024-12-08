import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createPost, getAllPost, likePostHandler } from '../controllers/post.controller';
import upload from '../middlewares/multer';

const router = express.Router();

router.route('/create-post').post(isAuthenticated, upload.single('image'), createPost);
router.route('/get-all-posts').get(isAuthenticated, getAllPost);
router.route('/:id/likeDislike').get(isAuthenticated, likePostHandler);

export default router;