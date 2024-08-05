const {db,sequelize} = require('../config/connection');
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


// Fetch users by society ID
exports.getUsersBySociety = asyncErrorHandler(async (req, res, next) => {
    // const { societyId } = req.params;

    // if (!societyId) {
    //     return next(new CustomError('Society ID is required', 400));
    // }

    // const query = `
    //     SELECT * FROM GetUsersBySociety($1);
    // `;
    // const values = [societyId];

    // try {
    //     const results = await db.connectDB.query(query, {
    //         bind: values,
    //         type: db.Sequelize.QueryTypes.SELECT
    //     });
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             users: results
    //         }
    //     });
    // } catch (error) {
    //     next(error);
    // }




//  using sequelize
const { societyId } = req.params;

if (!societyId) {
    return next(new CustomError('Society ID is required', 400));
}

try {
    const users = await db.User.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email', 'number', 'isOwner', 'isAdmin', 'isWINGADMIN', 'isMEMBER'],
        include: [
            {
                model: db.House,
                attributes: ['house_no'],
                include: [
                    {
                        model: db.Wing,
                        attributes: ['name'],
                        where: { SocietyId: societyId }
                    }
                ]
            }
        ]
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
} catch (error) {
    next(error);
}


});


// Fetch users by society ID and wing name
exports.getUsersBySocietyAndWing = asyncErrorHandler(async (req, res, next) => {
    const { societyId, wingName } = req.params;

    if (!societyId || !wingName) {
        return next(new CustomError('Society ID and Wing Name are required', 400));
    }

    const query = `
        SELECT * FROM GetUsersBySocietyAndWing($1, $2);
    `;
    const values = [societyId, wingName];

    try {
        const results = await db.connectDB.query(query, {
            bind: values,
            type: db.Sequelize.QueryTypes.SELECT
        });
        res.status(200).json({
            status: 'success',
            data: {
                users: results
            }
        });
    } catch (error) {
        next(error);
    }
});