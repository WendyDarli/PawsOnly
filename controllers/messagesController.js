const upload = require("../config/multer");
const express = require('express');
const app = express();
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

exports.message_delete = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id).populate('author');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.author._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You don't have authorization to perform this action" });
        }

        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted successfully' });

        
        req.originalUrl = '/req.user.profileImg';
      
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Show form
exports.message_edit_get = asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const message = await Message.findById(req.params.id).populate('messagecontent', 'messageImg');
    
    res.render('edit_message_form', {
        title: 'New Post',
        username: req.user.username,
        userProfileImg: req.user.profileImg,
        errors: errors.array(),
        post_text: message.messagecontent,
        messageImg: message.messageImg,

    });
});

//put edit
exports.message_edit_put = [
    //retrieve post image,
    //if no post iamge add one, otherwise keep ''
    //if new image, delete and replace previous and save the new img id
    
    upload.single('postImg'),
    //validation errors
    body('postText')
    .trim()
    .escape()
    .isLength({ min: 3}).withMessage('Your post need at least 3 characteres.')
    .custom((value) => {
        if (value.replace(/\s/g, '') === '') {
            throw new Error('Your post cannot be just spaces.');
        }
        return true;
    }),

    body('postImg'),

    asyncHandler(async (req, res, next) => {
        const existingMessage = await Message.findById(req.params.id);
        existingMessage.messagecontent = req.body.postText;
        existingMessage.postImg = req.file.path;

        if(!errors.isEmpty) {
            res.render('edit_message_form', {
                title: 'New Post',
                username: req.user.username,
                userProfileImg: req.user.profileImg,
                errors: errors.array(),
                post_text: existingMessage.messagecontent,
                messageImg: existingMessage.messageImg,
        
            });
        } else {
            await existingMessage.save();
            res.redirect('/dashboard');
        }
    })
];