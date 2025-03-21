import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createJob, getAllJobs, getSingleJob, getJobs, getSearchedJobs, updateJob, deleteJob, deleteAllJobs } from '../controllers/job.controller.js';
const router = express.Router();
router.route('/create-job').post(isAuthenticated, createJob);
router.route('/update-job/:id').post(isAuthenticated, updateJob);
router.route('/delete-job/:id').delete(isAuthenticated, deleteJob);
router.route('/delete-all-jobs').post(isAuthenticated, deleteAllJobs);
router.route('/fetch-jobs').get(isAuthenticated, getAllJobs);
router.route('/:id/details').get(isAuthenticated, getSingleJob);
router.route('/searchedJobs').get(getSearchedJobs);
router.route('/homeJobs').get(getJobs);
router.route('/test').get((req, res) => {
    res.send("Hello, testing route");
});
export default router;
