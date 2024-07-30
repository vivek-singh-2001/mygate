module.exports = (connectDB, DataTypes) => {
    const Blog = connectDB.define(
        'Blog',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            text: {
                type: DataTypes.STRING,
                allowNull: true
            },
            media: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            timestamps: true,
        }
    );
    return Blog;
}