const Users = require('../models/users');
const validationResult = require('express-validator');
const asyncHandler = require('express-async-handler');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

exports.index = asyncHandler(async(req, res, next) => {
    res.send('Not Implemented Yet');
});

exports.login_get = asyncHandler(async(req, res, next) => {
    
    if(req.user) {
        res.redirect('/dashboard');
        
    } else {
        res.render('login', {
            title: "Login"
        });
    };
    

});

exports.login_post = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
});

exports.logout = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});