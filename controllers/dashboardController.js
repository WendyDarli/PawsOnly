const asyncHandler = require('express-async-handler');
const Message = require('../models/messages');
const users = require('../models/users');

exports.index = asyncHandler(async(req, res, next) => {
    const messagesParams = await Message.find().populate('author', 'username profileImg');
    
    res.render('dashboard', {
        title: 'Dashboard',
        messagesParams: messagesParams,

    });


});