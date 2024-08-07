const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');
const signup_controller = require('../controllers/signupController');
const messages_controller = require('../controllers/messagesController')
const dashboard_controller = require('../controllers/dashboardController')
const profile_controller = require('../controllers/profileController');
const ensureAuthenticated = require('../controllers/auth');

router.get ('/', login_controller.index);

// LOGIN ROUTES

router.get('/login', login_controller.login_get);

router.post('/login', login_controller.login_post);

router.get('/logout', login_controller.logout);

//GOOGLE AUTH ROUTES

router.get('/auth/google', login_controller.auth_google);

router.get('/google/callback', login_controller.google_login);

router.get('/google/logout', login_controller.google_logout);

// SIGN UP ROUTES

router.get('/signup', signup_controller.signup_get);

router.post('/signup', signup_controller.signup_post);

//MESSAGES ROUTES

router.get('/dashboard', dashboard_controller.index);

router.get('/newpost', ensureAuthenticated, messages_controller.newpost_get);

router.post('/newpost', ensureAuthenticated, messages_controller.newpost_post);

router.delete('api/message/:id', messages_controller.message_delete);

router.get('/api/message/:id', messages_controller.message_edit_get)

router.post('/api/message/:id', messages_controller.message_edit_put);

// PROFILE ROUTES 

router.get('/profile', ensureAuthenticated, profile_controller.displayProfile_get);

router.get('/editprofile', ensureAuthenticated, profile_controller.updateProfile_get);

router.post('/editprofile', ensureAuthenticated, profile_controller.updateProfile_post);

router.get('/api/profile/:id', ensureAuthenticated, profile_controller.delete_profile);

router.post('/api/profile/:id', ensureAuthenticated, profile_controller.delete_profile_post);

router.get('/verify', ensureAuthenticated, profile_controller.sendEmail_verification);

router.get('/verify/:token', ensureAuthenticated, profile_controller.emailToken_verification);

module.exports = router;