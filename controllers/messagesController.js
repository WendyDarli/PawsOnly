const upload = require("../config/multer");

const asyncHandler = require('express-async-handler');
const Message = require('../models/messages');
const { body, validationResult } = require('express-validator');

exports.newpost_get = asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    
    res.render('messageForm', {
        title: 'New Post',
        username: req.user.username,
        userProfileImg: req.user.profileImg,
        errors: errors.array()
    });
});

exports.newpost_post = [

    upload.single('postImg'),
    
    body('postText').trim().escape()
    .isLength({ min: 3}).withMessage('Your post need at least 3 characteres.')
    .custom((value) => {
        if (value.replace(/\s/g, '') === '') {
            throw new Error('Your post cannot be just spaces.');
        }
        return true;
    }),

    body('postImg'),

    
    asyncHandler(async(req, res, next) => {


        const errors = validationResult(req);

        const message = new Message({
            author: req.user._id,
            messagecontent: req.body.postText,
            messageImg: req.file ? req.file.path : '',
        });

        if(!errors.isEmpty()) {
            res.render('messageForm', {
                title: 'New Post',
                username: req.user.username,
                userProfileImg: req.user.profileImg,
                messagecontent: req.body.postText,
                messageImg: req.file ? req.file.path : '',
                errors: errors.array()
            })
        } else {
            await message.save()
            res.redirect('/dashboard');
        }
    })
];