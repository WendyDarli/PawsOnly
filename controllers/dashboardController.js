const asyncHandler = require('express-async-handler');
const Message = require('../models/messages');
const users = require('../models/users');

exports.index = asyncHandler(async(req, res, next) => {
    try {
        const messagesParams = await Message.find().populate('author', 'username profileImg');
        const username = req.user ? req.user.username : null;
        
        if (!username) {
            res.render('dashboard', {
                title: 'Dashboard',
                username: null,
                messagesParams: messagesParams,
                error: 'You are not logged in! <a href="/login">Go to Login</a>'
            });
        } else {
            res.render('dashboard', {
                title: 'Dashboard',
                username: username,
                messagesParams: messagesParams,
                error: null
            });
        }
    } catch (error) {
        next(error);
    }
});