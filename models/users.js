const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    profileImg: {type: String, required: false},
    userame: {type: String , required: true },
    firstName: {type: String , required: true},
    lastName: {type: String , required: true },
    email: {type: String , required: true},
    password: {type: String, required: true},
    membershipStatus: {type: String, required: true},
    
});

UserSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);