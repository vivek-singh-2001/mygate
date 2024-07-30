module.exports = (connectDB,DataTypes)=>{

    const HouseUser = connectDB.define(
        'HouseUser',{
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            }
        }
    )
return HouseUser
}