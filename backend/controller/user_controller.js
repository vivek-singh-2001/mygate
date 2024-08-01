const {db} = require('../models/connection');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const { Sequelize, DataTypes } = require("sequelize");
const {Op} = Sequelize

// getting the user model instance
const User = db.User;

exports.getAllUser = asyncErrorHandler (async (req,res,next)=>{
    // const users = await User.findAll() ;

    // if(!users){
    //     return next(new CustomError("something went wrong", 400));
    // }
    // res.status(200).json({
    //     status:'success',
    //     data:{
    //         users
    //     }
    // })


// Extract query parameters from request
const { search } = req.query;

// Build search query
const whereClause = search ? {
    [Op.or]: [
        { firstname: { [Op.iLike]: `%${search}%` } },
        { number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
    ]
} : {};

// Fetch users based on search query
const users = await User.findAll({ where: whereClause });

res.status(200).json({
    status: 'success',
    data: {
        users
    }
});

})