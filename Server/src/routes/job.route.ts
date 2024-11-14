import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createJob, getAllJobs, getSingleJob, getJobs, getSearchedJobs } from '../controllers/job.controller';

const router = express.Router();

router.route('/create-job').post(isAuthenticated, createJob);
router.route('/fetch-jobs').get(isAuthenticated, getAllJobs);
router.route('/:id/details').get(isAuthenticated, getSingleJob);
router.route('/searchedJobs').get(getSearchedJobs);
router.route('/homeJobs').get(getJobs);

export default router;