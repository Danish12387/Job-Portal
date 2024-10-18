import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createJob, getJobs } from '../controllers/job.controller';

const router = express.Router();

router.route('/create-job').post(isAuthenticated, createJob);
router.route('/fetch-jobs').get(isAuthenticated, getJobs);

export default router;