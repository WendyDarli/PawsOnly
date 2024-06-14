const asyncHandler = require('express-async-handler');
const messages = require('../models/messages');

exports.messages_get = asyncHandler(async(req, res, next) => {
    res.send('Not Implemented Yet');
});