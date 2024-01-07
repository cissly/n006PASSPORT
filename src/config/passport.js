const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("../models/users.model");

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


passport.use('local',new LocalStrategy({usernameField: 'email', passwordField: 'password'},
    (email,password,done) => {
        console.log("haha")
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
) )