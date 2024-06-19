const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    profileImg: {type: String, default: '../uploads/users_profile_images/default.jpg', required: false},
    username: {type: String , required: true, unique: true},
    firstName: {type: String , required: true},
    lastName: {type: String , required: true },
    email: {type: String , required: true, unique: true},
    hash: {type: String},
    salt: {type: String},
    membershipStatus: {type: String, default: 'Member', required: true},
    
});

UserSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
});

UserSchema.statics.findUserByUsername = async function(username) {
    return await this.findOne({ username: username });
};

UserSchema.statics.findUserByEmail = async function(email) {
    return await this.findOne({ email: email });
};



module.exports = mongoose.model("User", UserSchema);