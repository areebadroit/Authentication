var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    PassportLocalMongoose = require('passport-local-mongoose'),
    app = express();

var User = require("./models/user");

const database = 'mongodb+srv://areeb:zNntxsYsd8yhmYev@test-icewh.mongodb.net/test?retryWrites=true&w=majority'||'mongodb://localhost:27017/authentication';
mongoose.connect(database, { useNewUrlParser: true,useUnifiedTopology: true}, (err) => {
    if(err)
        console.log('Unable to connect to mongoDB servers');
    else 
        console.log('Connected to MongoDB servers');
});
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============================================ROUTES====================================================

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req,res) => {
    res.render("secret");
});

//Authentication ROUTES
app.get("/register", (req,res) => {
    res.render("register");
});

//handling user signup
app.post("/register", (req,res) => {
    var uname = req.body.username;
    var password = req.body.password;
    User.register(new User({username: uname}), password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secret");
        });
    });
});

//login route
app.get("/login", (req,res) => {
    res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {

});

//logout
app.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next)  {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Code to run the server
const DEFAULT_PORT = 3000;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
	PEER_PORT = DEFAULT_PORT + 1 - 1000 + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port: ${PORT}`);
});