const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    messagecontent: {type: String, required: true},
    messageImg: {type: String, default: '', required: false},
    publishedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", messageSchema);