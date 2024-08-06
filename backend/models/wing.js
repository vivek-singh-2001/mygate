const { DataTypes } = require("sequelize")
const society = require("../features/society/societyModel")

module.exports = (connectDB,DataTypes)=>{
    const Wing = connectDB.define(
        'Wing',
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false

            },
            name:{
                unique:false,
                allowNull:false,
                type:DataTypes.STRING(10)
            }
            
        }
    ) 
    return Wing
}