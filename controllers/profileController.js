const uploadProfileImage = require("../config/multerProfileImg");

const asyncHandler = require('express-async-handler');
const User = require('../models/users');
const { body, validationResult } = require('express-validator');

const { unlink } = require('fs').promises;

exports.displayProfile_get = asyncHandler(async(req, res, next) => {
    res.render('display_profile', {
        title: 'Profile',
        username: req.user.username,
        profileImg: req.user.profileImg,
        fname: req.user.firstName,
        lname: req.user.lastName,
        email: req.user.email,
        membershipStatus:req.user.membershipStatus
    });
});


exports.updateProfile_get = asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    
    res.render('edit_profile', {
        title: 'Edit Profile',
        username: req.user.username,
        profileImg: req.user.profileImg,
        fname: req.user.firstName,
        lname: req.user.lastName,
        email: req.user.email,
        errors: errors.array(),

    });
});


exports.updateProfile_post = [
    uploadProfileImage.single("ProfileImg"),

    body('username')
    .trim()
    .isLength({min:3}).withMessage('Username must contain more than 3 characteres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('Username must contain only letters and spaces.')
    .custom(async (value, { req }) => {
        const user = await User.findUserByUsername(value);
        if (user && user._id.toString() !== req.user._id.toString()) {
          throw new Error('Username already in use.');
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

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('edit_profile', {
                title: 'Edit Profile',
                username: req.body.username,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.user.email,
                profileImg: req.file ? req.file.path : req.user.profileImg,
                errors: errors.array(),
            });
        } 

        // Delete previous profile image and keep the new one
        if (req.file && req.file.path && req.user.profileImg !== '../uploads/users_profile_images/default.jpg') {
  
            try {
                await unlink(req.user.profileImg);

            } catch (err) {
                console.error(err);
            }
        }

        const user = new User({
            username: req.body.username,
            firstName: req.body.fname,
            lastName: req.body.lname,
            profileImg: req.file ? req.file.path : req.user.profileImg,
            _id: req.user._id,
        });
        
        const updateProfile =  await User.findByIdAndUpdate(req.user._id, user, {});
        res.redirect(`/profile`);
    })
]; 