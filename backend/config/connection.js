const { Sequelize, DataTypes } = require("sequelize");

const database = process.env.DATABASE;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// ==== TO CONNECT TO LOCAL DATABASE ====
const connectDB = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

// ==== TO CONNECT TO REMOTE DATABASE ====

const db = {};
db.Sequelize = Sequelize;
db.connectDB = connectDB;


db.User = require('../features/users/userModel')(connectDB,DataTypes)
db.House = require('../features/house/houseModel.js')(connectDB,DataTypes)
db.Blog = require('../features/blog/blogModel.js')(connectDB,DataTypes)
db.Notice = require('../features/notice/noticeModel.js')(connectDB,DataTypes)
db.Society = require('../features/society/societyModel')(connectDB,DataTypes)
db.Wing = require('../features/wing/wingmodel.js')(connectDB,DataTypes)
db.HouseUser = require('../features/houseuser/HouseUserModel.js')(connectDB,DataTypes)



// =============society-wing (: One to many)============================

db.Society.hasMany(db.Wing);
db.Wing.belongsTo(db.Society);

// =============wing-house (: One to many)============================

db.Wing.hasMany(db.House);
db.House.belongsTo(db.Wing);


// =============wing-notice (: One to many)============================

db.Wing.hasMany(db.Notice);
db.Notice.belongsTo(db.Wing);


// =============user-notice (: One to many)============================

db.User.hasMany(db.Notice);
db.Notice.belongsTo(db.User);


// =============blog-user (: One to many)============================

db.User.hasMany(db.Blog);
db.Blog.belongsTo(db.User);



// ==============house-user (: Many to many)=========================

db.User.belongsToMany(db.House, { through: db.HouseUser });
db.House.belongsToMany(db.User, { through: db.HouseUser });


const check = async () => {
  try {
    await connectDB.authenticate();
    console.log("Connection has been established successfully.");
    await db.connectDB.sync({ alter: true, force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = { db, check };

