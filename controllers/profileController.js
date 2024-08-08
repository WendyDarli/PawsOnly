const uploadProfileImage = require("../config/multerProfileImg");

const asyncHandler = require('express-async-handler');
const User = require('../models/users');
const { body, validationResult } = require('express-validator');
const Message = require("../models/messages");

const { unlink } = require('fs').promises;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


exports.displayProfile_get = asyncHandler(async(req, res, next) => {
    res.render('display_profile', {
        title: 'Profile',
        username: req.user.username,
        profileImg: req.user.profileImg,
        fname: req.user.firstName,
        lname: req.user.lastName,
        email: req.user.email,
        verified: req.user.verified,
        membershipStatus:req.user.membershipStatus,
        id: req.user._id,
    });
});


exports.updateProfile_get = asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    
    res.render('edit_profile', {
        title: 'Edit Profile',
        username: req.user.username,
        profileImg: req.user.profileImg,
        fname: req.user.firstName,
        lname: req.user.lastName,
        email: req.user.email,
        errors: errors.array(),

    });
});


exports.updateProfile_post = [
    uploadProfileImage.single("ProfileImg"),

    body('username')
    .trim()
    .isLength({min:3}).withMessage('Username must contain more than 3 characteres.')
    .isLength({max:10}).withMessage('Username must contain less than 11 characteres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('Username must contain only letters and spaces.')
    .custom(async (value, { req }) => {
        const user = await User.findUserByUsername(value);
        if (user && user._id.toString() !== req.user._id.toString()) {
          throw new Error('Username already in use.');
        }
      })
    .escape(),

    body('fname')
    .trim()
    .isLength({min:3}).withMessage('First name must contain more than 3 characteres.')
    .isLength({max:20}).withMessage('First name must contain less than 20 charateres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('First name must contain only letters and spaces.')
    .escape(),
    
    body('lname')
    .trim()
    .isLength({min:3}).withMessage('Last name must contain more than 3 characteres.')
    .isLength({max:20}).withMessage('Last name must contain less than 20 charateres.')
    .matches(/^[a-zA-Z ]*$/).withMessage('Last name must contain only letters and spaces.')
    .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('edit_profile', {
                title: 'Edit Profile',
                username: req.body.username,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.user.email,
                profileImg: req.file ? req.file.path : req.user.profileImg,
                errors: errors.array(),
            });
        } 

        // Delete previous profile image and keep the new one
        if (req.file && req.file.path && req.user.profileImg !== '../uploads/users_profile_images/default.jpg') {
  
            try {
                await unlink(req.user.profileImg);

            } catch (err) {
                console.error(err);
            }
        }

        const user = new User({
            username: req.body.username,
            firstName: req.body.fname,
            lastName: req.body.lname,
            profileImg: req.file ? req.file.path : req.user.profileImg,
            _id: req.user._id,
        });
        
        const updateProfile =  await User.findByIdAndUpdate(req.user._id, user, {});
        res.redirect(`/profile`);
    })
]; 


exports.delete_profile = asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    res.render('delete_profile', {
        title: 'Delete Profile',
        id: req.user._id,
        errors: errors.array(),
    });
});
exports.delete_profile_post = [

    body('username')
        .trim()
        .custom(async (value, { req }) => {
            if (req.user.username !== value) {
                throw new Error("Usernames don't match.");
            }
            return true;
        })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('delete_profile', {
                title: 'Delete Profile',
                id: req.user._id,
                username: req.body.username,
                errors: errors.array(),
            });
        }


        const user = await User.findById(req.params.id); 
        const userPosts = await Message.find({ author: req.user._id}).populate('messageImg');

        try {
            if(!user) {
                return res.status(404).send('User not found.');
            }


            if(req.user.profileImg && req.user.profileImg !== '../uploads/users_profile_images/default.jpg') {
                
                try {
                    await unlink(req.user.profileImg);

                } catch {
                    console.log(errors);
                }
            }            


            if(!userPosts){
                const deleteUser = await User.findByIdAndDelete(req.params.id);
            }


            for(const post of userPosts){
                if(post.messageImg){
                    try{
                        await unlink(post.messageImg);
                    } catch {
                        console.log(errors);
                    }
                }
            }

            const postIds = userPosts.map(post => post._id);
            const deleteUserPosts = await Message.deleteMany({ _id: { $in: postIds  }});
            const deleteUser = await User.findByIdAndDelete(req.params.id);
                        
            res.redirect('/login');
        } catch (err) {
            return next(errors);
        }

    }),
];

exports.sendEmail_verification = asyncHandler(async (req, res, next) => {
    if(req.user.verified) {
        res.render('emailVerified', {
            title: 'Email Verified',
            contenth1: 'Your E-mail is already verified.',
            contentp: 'Go back.'
        })
    }
    else {
        const user = { email: req.user.email };
          
        const emailToken = jwt.sign({
            email: user.email
        }, process.env.VERIFY_EMAIL_TOKEN_SECRET, { expiresIn: '15m' });
          
        const verificationUrl = `http://localhost:3000/verify/${emailToken}`;
    
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });
          
        let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email, // Mudei para enviar para o e-mail do usuário
            subject: 'PawsOnly E-mail Verification',
            text: `Hi There!
                  Please follow the given link to verify your email:
                  ${verificationUrl} 
                  Expires in 15 minutes.
                  Thanks!`
        };
    
        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log("Error " + err);
                res.status(500).send('Error: ' + err);
            } else {
                console.log("Email sent successfully");
                // Renderiza a página de verificação de e-mail somente após o envio do e-mail
                res.render('verifyEmail', {
                    title: 'Verify your e-mail',
                    email: user.email,
                });
            }
        });
    }
    
    
});


exports.emailToken_verification = asyncHandler(async(req, res, next) => {
    const token = req.params.token;

    try {
        
        const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_TOKEN_SECRET, { clockTolerance: 60 });
        const email = decoded.email;

        const verifyEmail = await User.findOneAndUpdate(
            { email: email },
            { verified: true },
            { new: true, runValidators: true } 
        );

        if (!verifyEmail) {
            return res.status(404).send('User not found');
        }
        else {
            res.render('emailVerified', {
                title: 'Email Verified',
                contenth1: 'E-mail verified successfully.',
                contentp: 'You can close this page now.'
            })
        }  
          
    } catch (err) {
        res.status(400).send('Invalid or expired token. ' + err.message);
    }
});


  
