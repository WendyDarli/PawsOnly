const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User = require('../models/users')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  
},
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        user = new User({
          googleId: profile.id,
          profileImg: '../uploads/users_profile_images/default.jpg',
          username: profile.displayName,
          firstName: profile.name.givenName ? profile.name.givenName : '',
          lastName: profile.name.familyName ? profile.name.familyName : '' ,
          email: profile.emails[0].value
        });

        await user.save();
        return done(null, user);
      }
    } catch (error) {
      console.error(error);
      return done(error, null);
    }
  }
  ));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});