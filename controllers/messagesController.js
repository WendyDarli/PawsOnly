const upload = require("../config/multer");

const asyncHandler = require('express-async-handler');
const Message = require('../models/messages');
const { body, validationResult } = require('express-validator');

exports.newpost_get = asyncHandler(async(req, res, next) => {
    res.render('messageForm', {
        title: 'New Post',
        username: req.user.username,
        userProfileImg: req.user.profileImg
    });
});

exports.newpost_post = [

    upload.single('postImg'), 
    body('postText').trim().escape(),
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