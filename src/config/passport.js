const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("../models/users.model");
const GoogleStrategy = require('passport-google-oauth20')

// req.login(user)

passport.serializeUser((user,done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
})

const localStrategyConfig = new LocalStrategy({usernameField: 'email', passwordField: 'password'},
(email,password,done) => {
    User.findOne({
        email: email.toLocaleLowerCase()
    }).then((user) => {

        if(!user) {
            return done(null, false, {msg : `Email ${email} not found`});
        }

        user.comparePassword(password, (err,isMathc) => {
            if(err) return done(err);

            if(isMathc) {
                return done(null,user)
            }

            return done(null, false, {msg: 'Invalid email or password.'})
        })
    }).catch( err => {
        return done(err);
    })
}
)
passport.use('local',localStrategyConfig )
//id
//


//pwd
//


const googleStrategyConfig = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile']
}, (accessToekn,refreshToken, profile, done)=> {
    User.findOne({googleId: profile.id}).then((existingUser) => {
        if(existingUser){
            return done(null,existingUser)
        }else{
            const user = new User();
            user.email = profile.emails[0].valuel
            user.googleId = profile.id;
            user.save().catch((err) => {
                console.log(err);
                if(err) {return done(err)}
                done(null,user)
            })
        }
    })
    .catch( err => {
        return done(err);
    })
})
passport.use('google', googleStrategyConfig)

