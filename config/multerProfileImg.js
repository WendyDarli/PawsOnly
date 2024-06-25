const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) { 
        cb(null, "./uploads/users_profile_images")
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadProfileImage = multer({ storage });

module.exports = uploadProfileImage;