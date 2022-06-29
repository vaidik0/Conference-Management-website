const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express();
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const router = require('./routes');
const MongoStore = require('connect-mongodb-session')(session);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.use('/uploads',express.static(__dirname+'/uploads'));

// set up view engine
app.set('view engine','ejs');
app.set('views','./views');

const store = new MongoStore({
    uri: 'mongodb://localhost/conference_users_db' ,
    collection:'mySessions'
})

app.use(session({
    name:'Web Development',
    secret:'Random Text',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express Router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server',err);
    }
    else{
        console.log('Server is running successfully at port number ',port);
    }
});