const express = require("express");
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./utils/globalErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

// import routes here 
const user_route = require('./features/users/userApis');
const society_route = require('./features/society/societyApis');
const auth_route = require('./features/authentication/authApi');

// USE MODULES HERE
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// USE ROUTES HERE
app.use('/api/v1/users', user_route);
app.use('/api/v1/society', society_route);
app.use('/api/v1/auth', auth_route);
app.use('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server`, 404);
    next(err);
});

// ERROR HANDLER MUST BE DEFINED LAST
app.use(globalErrorHandler);

module.exports = app;
