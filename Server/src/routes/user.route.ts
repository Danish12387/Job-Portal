import express from 'express';
import { checkAuth, deleteProfileBanner, deleteProfilePic, editAdditionalDetails, editHobbies, editProfile, editProfileAbout, editProfileBanner, editProfilePic, getSuggestedUsers, getUserDetails, getUserJobs, login, logout, signup } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/check-auth').get(isAuthenticated, checkAuth);
router.route('/:id/details').get(isAuthenticated, getUserDetails);
router.route('/edit-profile').post(isAuthenticated, editProfile);
router.route('/edit-profile-about').post(isAuthenticated, editProfileAbout);
router.route('/edit-hobbies').post(isAuthenticated, editHobbies);
router.route('/edit-additional-details').post(isAuthenticated, editAdditionalDetails);
router.route('/edit-profile-pic').post(isAuthenticated, upload.single('profilePicture'), editProfilePic);
router.route('/edit-profile-banner').post(isAuthenticated, upload.single('profileBanner'), editProfileBanner);
router.route('/delete-profile-pic').post(isAuthenticated, deleteProfilePic);
router.route('/delete-profile-banner').post(isAuthenticated, deleteProfileBanner);
router.route('/get-user-jobs').get(isAuthenticated, getUserJobs);
router.route('/get-suggested-users').get(isAuthenticated, getSuggestedUsers);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;