const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

const User = require('../models/users');
const genPassword = require('../lib/passwordUtils').genPassword;

exports.signup_get = asyncHandler(async(req, res, next) => {

    if(req.user) {
        res.redirect('/dashboard');

    } else {
        const errors = validationResult(req);
        res.render('signup', {
            title: "Sign Up",
            errors: errors.array()
        });
    };

});


exports.signup_post = [
    
    body('username')
    .trim()
    .isLength({min:3}).withMessage('Username must contain more than 3 characteres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('Username must contain only letters and spaces.')
    .custom(async value => {
        const username = await User.findUserByUsername(value);
        if(username) {
            throw new Error('Username already in use.')
        }
    })
    .escape(),
    
    body('fname')
    .trim()
    .isLength({min:3}).withMessage('First name must contain more than 3 characteres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('First name must contain only letters and spaces.')
    .escape(),
    
    body('lname')
    .trim()
    .isLength({min:3}).withMessage('Last name must contain more than 3 characteres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('Last name must contain only letters and spaces.')
    .escape(),

    body('email')
    .trim()
    .isEmail().withMessage('Please use a valid E-mail address.')
    .custom(async value => {
        const email  = await User.findUserByEmail(value);
        if(email) {
            throw new Error('E-mail already in use.')
        }
    })
    .escape(),

    body('password')
    .trim()
    .isLength({min:6}).withMessage('Password must contain more than 6 characteres.')
    .custom(value => { 
        if(!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter.')
        }
        return true;
    })
    .custom(value => { 
        if(!/[0-9]/.test(value)) {
            throw new Error('Password must contain at least one number.')
        }
        return true;
    })
    .custom(value => { 
        if(!/[!@#\$%\^\&*\)\(+=._-]/.test(value)) {
            throw new Error('Password must contain at least one symbol.')
        }
        return true;
    })
    .escape(),

    body('confirmpass')
    .trim()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match.');
        }
        return true; 
    })
    .escape(),

    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req);
        const saltHash = genPassword(req.body.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const user = new User({
            username: req.body.username,
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            hash: hash,
            salt: salt
        });

        if (!errors.isEmpty()) {         

            res.render('signup', {
                title: 'Sign Up',
                username: req.body.username,
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                errors: errors.array()
            })
            
        } else {
            await user.save()
            res.redirect('/login');
        }
    })
];