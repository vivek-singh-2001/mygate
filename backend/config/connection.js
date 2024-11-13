const { Sequelize, DataTypes } = require("sequelize");

const database = process.env.DATABASE;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// ==== TO CONNECT TO LOCAL DATABASE ====
const connectDB = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

// ==== TO CONNECT TO REMOTE DATABASE ====

const db = {};
db.Sequelize = Sequelize;
db.connectDB = connectDB;

db.User = require("../features/users/userModel")(connectDB, DataTypes);
db.House = require("../features/house/houseModel.js")(connectDB, DataTypes);
db.Blog = require("../features/blog/blogModel.js")(connectDB, DataTypes);
db.Notice = require("../features/notice/noticeModel.js")(connectDB, DataTypes);
db.Society = require("../features/society/societyModel")(connectDB, DataTypes);
db.Wing = require("../features/wing/wingModel.js")(connectDB, DataTypes);
db.Floor = require("../features/floor/floorModel.js")(connectDB, DataTypes);
db.HouseUser = require("../features/houseuser/houseUserModel.js")(connectDB, DataTypes);
db.Chat = require("../features/chat/chatModel.js")(connectDB, DataTypes);
db.Event = require("../features/events/eventModel.js")(connectDB, DataTypes);
db.Role = require("../features/users/roleModel")(connectDB, DataTypes);
db.UserRole = require("../features/users/userRoleModel")(connectDB, DataTypes);
db.Visitor = require("../features/visitors/visitorModel.js")(connectDB, DataTypes);
db.Staff = require("../features/staff/staffModel.js")(connectDB, DataTypes);
db.Shift = require("../features/shift/shiftModel.js")(connectDB, DataTypes);
db.NotificationCount = require("../features/notificationCount/notificationCountModel.js")(connectDB, DataTypes);
db.SocietyStaff = require("../features/society/societyStaffModel.js")(connectDB, DataTypes);
db.Payment = require("../features/payment/paymentModel.js")(connectDB, DataTypes);
db.SocietyExpense = require("../features/expenses/societyExpensesModel.js")(connectDB,DataTypes)

// =============society-wing (: One to many)============================

db.Society.hasMany(db.Wing, { foreignKey: "societyId" });
db.Wing.belongsTo(db.Society, { foreignKey: "societyId" });

// // =============floor-wing (: One to many)============================

db.Wing.hasMany(db.Floor, { foreignKey: "wingId" });
db.Floor.belongsTo(db.Wing, { foreignKey: "wingId" });

// =============wing-notice (: One to many)============================

db.Society.hasMany(db.Notice, { foreignKey: "societyId" });
db.Notice.belongsTo(db.Society, { foreignKey: "societyId" });

// =============wing-user (: One to many)============================

db.User.hasMany(db.Wing, { foreignKey: "wingAdminId" });
db.Wing.belongsTo(db.User, { foreignKey: "wingAdminId" });

// =============society-user (: One to many)============================
db.User.hasMany(db.Society, { foreignKey: "societyAdminId" ,as:'societyDetails'});
db.Society.belongsTo(db.User, { foreignKey: "societyAdminId",as:'societyDetails' });

// =============user-notice (: One to many)============================

db.User.hasMany(db.Notice, { foreignKey: "userId" });
db.Notice.belongsTo(db.User, { foreignKey: "userId" });

// =============blog-user (: One to many)============================

db.User.hasMany(db.Blog, { foreignKey: "userId" });
db.Blog.belongsTo(db.User, { foreignKey: "userId" });

// =============event-society (: One to many)============================

db.Society.hasMany(db.Event, { foreignKey: "societyId" });
db.Event.belongsTo(db.Society, { foreignKey: "societyId" });

// =============house-floor (: One to many)============================

db.Floor.hasMany(db.House, { foreignKey: "floorId" });
db.House.belongsTo(db.Floor, { foreignKey: "floorId" });

// ==============house-user (: Many to many)=========================

db.User.belongsToMany(db.House, {
  through: db.HouseUser,
  foreignKey: "userId",
  otherKey: "houseId",
});

db.House.belongsToMany(db.User, {
  through: db.HouseUser,
  foreignKey: "houseId",
  otherKey: "userId",
});
db.House.hasMany(db.HouseUser, { foreignKey: "houseId" });
db.HouseUser.belongsTo(db.House, { foreignKey: "houseId" });
db.HouseUser.belongsTo(db.User, { foreignKey: "userId" });
db.User.hasMany(db.HouseUser, { foreignKey: "userId" });

// ==============user-role (: Many to many)=========================

db.User.belongsToMany(db.Role, {
  through: db.UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
});
db.Role.belongsToMany(db.User, {
  through: db.UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
});
db.User.hasMany(db.UserRole, { foreignKey: "userId" });
db.UserRole.belongsTo(db.User, { foreignKey: "userId" });
db.UserRole.belongsTo(db.Role, { foreignKey: "roleId" });
db.Role.hasMany(db.UserRole, { foreignKey: "userId" });

// ==============user-chat ========================================

db.User.hasMany(db.Chat, { foreignKey: "senderId", as: "sentMessages" });
db.User.hasMany(db.Chat, { foreignKey: "receiverId", as: "receivedMessages" });

db.Chat.belongsTo(db.User, { foreignKey: "senderId", as: "sender" });
db.Chat.belongsTo(db.User, { foreignKey: "receiverId", as: "receiver" });

// ============== house-visitor (One to many) ======================

db.House.hasMany(db.Visitor, { foreignKey: "houseId", allowNull: true });
db.Visitor.belongsTo(db.House, { foreignKey: "houseId", allowNull: true });

// ============== user-visitor (One to many) ======================

db.User.hasMany(db.Visitor, { foreignKey: "responsibleUser" });
db.Visitor.belongsTo(db.User, { foreignKey: "responsibleUser" });

// ==============staff-society (: One to many)=========================
db.Society.hasMany(db.Staff, { foreignKey: "societyId" });
db.Staff.belongsTo(db.Society, { foreignKey: "societyId" });

// ==============staff-role (: One to many)=========================
db.Role.hasMany(db.Staff, { foreignKey: "roleId" });
db.Staff.belongsTo(db.Role, { foreignKey: "roleId" });

// ==============staff-shift (: One to many)=========================
db.Staff.hasMany(db.Shift, { foreignKey: "staffId" });
db.Shift.belongsTo(db.Staff, { foreignKey: "staffId" });

// ==============notification count with society and user (: One to many)=========================
db.Society.hasMany(db.NotificationCount, { foreignKey: "societyId" });
db.NotificationCount.belongsTo(db.Society, { foreignKey: "societyId" });

db.User.hasMany(db.NotificationCount, { foreignKey: "userId" });
db.NotificationCount.belongsTo(db.User, { foreignKey: "userId" });

// =============societyStaff with society and user (: One to many)=========================

db.User.belongsToMany(db.Society, {
  through: db.SocietyStaff,
  foreignKey: "staffId",
  otherKey: "societyId",
});
db.Society.belongsToMany(db.User, {
  through: db.SocietyStaff,
  foreignKey: "societyId",
  otherKey: "staffId",
});
db.User.hasMany(db.SocietyStaff, { foreignKey: "staffId" });
db.SocietyStaff.belongsTo(db.User, { foreignKey: "staffId" });
db.SocietyStaff.belongsTo(db.Society, { foreignKey: "societyId", as: 'Society', });
db.Society.hasMany(db.SocietyStaff, { foreignKey: "societyId",as:'Staff' });

// ==============user-payment (: One to many)=========================
db.User.hasMany(db.Payment, { foreignKey: "ownerId" });
db.Payment.belongsTo(db.User, { foreignKey: "ownerId" });


// ==============society-societyExpanses (: One to many)=========================
db.Society.hasMany(db.SocietyExpense, { foreignKey: 'societyId' });
db.SocietyExpense.belongsTo(db.Society, { foreignKey: 'societyId' });



const check = async () => {
  try {
    await connectDB.authenticate();
    console.log("Connection has been established successfully.");
    await db.connectDB.sync({ alter: false, force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = { db, check };
