const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');
const signup_controller = require('../controllers/signupController');
const messages_controller = require('../controllers/messagesController')
const dashboard_controller = require('../controllers/dashboardController')

router.get ('/', login_controller.index);

// LOGIN ROUTES

router.get('/login', login_controller.login_get);

router.post('/login', login_controller.login_post);

router.get('/logout', login_controller.logout);

// SIGN UP ROUTES

router.get('/signup', signup_controller.signup_get);

router.post('/signup', signup_controller.signup_post);

//MESSAGES ROUTES

router.get('/dashboard', dashboard_controller.index);

router.get('/newpost', messages_controller.newpost_get);

router.post('/newpost', messages_controller.newpost_post);


module.exports = router;