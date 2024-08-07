const express = require("express");
const morgan = require('morgan');
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./utils/globalErrorHandler')
const cookieParser = require('cookie-parser');
const cors = require('cors')

// import routes here 
const user_route = require('./features/users/userApis');
const society_route = require('./features/society/societyApis');
const auth_route = require('./routes/auth_route')

// USE MODULES HERE
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// USE ROUTES HERE
app.use('/api/v1/users',user_route)
app.use('/api/v1/society',society_route)
app.use('/api/v1/auth',auth_route)
app.use('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server`, 404);
    next(err)
})


// ERROR HANDLER MUST BE DEFINED LAST
app.use(globalErrorHandler);

module.exports = app;
