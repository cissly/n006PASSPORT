const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
const User = require("./models/users.model");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { checkAuthenticated, checkNotAuthenticated } = require("./middleware/auth");
const app = express();
const port = 4000;

const cookieEncryptionKey = ['key1', 'key2']
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


app.use(cookieSession({
    name: 'cookie-session-name',
    keys: cookieEncryptionKey
}))

app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb) => {
        cb()
      }
    }
    if (request.session && !request.session.save) {
      request.session.save = (cb) => {
        cb()
      }
    }
    next()
  })

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended: false}));


mongoose.connect(`mongodb+srv://tkdwls237:tkdwls45@cluster0.rcpcfst.mongodb.net/?retryWrites=true&w=majority`)
    .then( () => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.log(err)
    })




app.get("/", checkAuthenticated,(req,res) => {
    res.render('index.ejs')
})

app.get("/login", checkNotAuthenticated,(req,res) => {
    res.render('login.ejs')
})



app.post('/login', (req,res,next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.json({msg: info});
        }

        req.logIn(user,function (err) {
            if (err) {return next(err);}
            res.redirect('/');
        })
    })(req,res,next) 
})


app.post('/logout', (req,res) => {
    req.logOut(function(err) {
        if(err) { return next(err)}
        res.redirect('/login')
    })
})


app.get("/signup", checkNotAuthenticated,(req,res) => {
    res.render('signup')
})

app.post('/signup', async(req,res) => {
    const user = new User(req.body)

    try{
        await user.save();
        return res.status(200).json({
            success: true
        })
    }
    catch (err){
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})