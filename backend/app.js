const express = require("express");
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./utils/globalErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');



// import routes here 
const user_route = require('./features/users/userApis');
const society_route = require('./features/society/societyApis');
const wing_route = require('./features/wing/wingApis');
const house_route = require('./features/house/houseApi');
const houseuser_route = require('./features/houseuser/houseuserApis');
const auth_route = require('./features/authentication/authApi');
const sms_route = require('./features/sms/smsApis')
const event_route = require('./features/events/eventRoute')
const chatRoutes = require('./features/chat/chatApi');

// USE MODULES HERE
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files from the 'dist' directory (or wherever Angular builds your files)
app.use('/static', express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',  // Cache static assets for 1 year
    setHeaders: function (res, path) {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
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
app.use('/api/v1/wing', wing_route);
app.use('/api/v1/house', house_route);
app.use('/api/v1/houseuser', houseuser_route);
app.use('/api/v1/auth', auth_route);
app.use('/api/v1/sms', sms_route);
app.use('/api/v1/events', event_route);
app.use('/api/v1/chats', chatRoutes);
app.use('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server`, 404);
    next(err);
});

// ERROR HANDLER MUST BE DEFINED LAST
app.use(globalErrorHandler);

module.exports = app;
