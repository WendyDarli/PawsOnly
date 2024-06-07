const mongoose = mrequire('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: {type: Object_id, required: true},
    messagecontent: {type: String, required: true},
    messageImg: {type: String, required: false}
});

module.exports = mongoose.model("Message", messageSchema);