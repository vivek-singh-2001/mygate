const {db} = require('../models/connection');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');


// getting the user model instance
const User = db.User;




exports.getAllUser = asyncErrorHandler (async (req,res,next)=>{
    const users = await User.findAll() ;


    res.status(200).json({
        status:'success',
        data:{
            users
        }
    })
})