require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/////////connect to mongodb//////////////////////////
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => {console.log(err);});

//////////create schemas//////////////////////////////
const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const habitSchema = mongoose.Schema({
    username: String,
    habitname: {type: String, required: true},
    streak: {type: Number, default: 0}
});

userSchema.plugin(passportLocalMongoose);

///////////////create models/////////////////////////////////
const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////home route//////////////////////////////////////
app.get('/', (req,res) => {
    res.send('home page');
});

/////////////////habits route////////////////////////////

app.route('/habits')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.send('you are authenticated and now in habits dashboard');
        } else {
            res.send('You are not authenticated! Login');
        }
    })

    .post(async (req, res) => {
        try {
            const newHabit = new Habit({
            username: req.user.username,
            habitname: req.body.habit,
            streak: 0
        });
        await newHabit.save();
        res.send('Habit saved successfully!')

        } catch (err) {
            res.send('error creating a new habit');
            console.log(err);
        }
    });

///////////register route////////////////////////////

app.route('/register')
    .get((req, res) => {
        res.send('You are now on registration page');
    })

    .post((req, res) => {
        User.register({username: req.body.username}, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.send('Failed to register user');
            } 
            
            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.send('Error registering user');
                }
                res.send('User registered!');
            });
        });
    });

///////////////Login route/////////////////////////////    

app.route('/login')
    .get((req, res) => {
        res.send('This is the login page');
    })

    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        passport.authenticate('local',(err, user, info) =>{
            if (err) {
                return res.status(500).json({error: err.message});
            }
            if(!user) {
                return res.status(401).json('Invalid username or password');
            }
        });

        req.logIn(user,(err) => {
            if(err) {
                return res.status(500).json({error: err.message});
            }
            return res.status(200).json({message: "Login successful"});
        });
    });


app.listen(3000, (req, res) => {
    console.log('server running on port 3000');
});