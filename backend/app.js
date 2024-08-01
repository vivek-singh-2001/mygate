const express = require("express");
const morgan = require('morgan');
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./utils/globalErrorHandler')



const user_route = require('./routes/user_route');


// USE MODULES HERE
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// USE ROUTES HERE
app.use('/api/v1/users',user_route)
app.use('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server`, 404);
    next(err)
})


// ERROR HANDLER MUST BE DEFINED LAST
app.use(globalErrorHandler);

module.exports = app;
