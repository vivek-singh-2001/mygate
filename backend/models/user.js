const { types } = require("pg")

module.exports = (connectDB, DataTypes) => {
    const User = connectDB.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            firstname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            passcode: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue:1111111
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.VIRTUAL,
                get() {
                    return () => this.generatePassword();
                },
                set(value) {
                    if (value) {
                        this.setDataValue('hashedPassword', bcrypt.hashSync(value, 10));
                    }
                }
            },
            hashedPassword: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dateofbirth: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            isOwner: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isWINGADMIN: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isMEMBER: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }

        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    const generatedPassword = user.generatePassword();
                    user.hashedPassword = await bcrypt.hash(generatedPassword, 10);
                },
                beforeUpdate: async (user) => {
                    if (user.changed('firstname') || user.changed('dateofbirth')) {
                        const generatedPassword = user.generatePassword();
                        user.hashedPassword = await bcrypt.hash(generatedPassword, 10);
                    }
                }
            }
        }
    )
    User.prototype.generatePassword = function() {
        const firstFourLettersOfFirstName = this.firstname.slice(0, 2).toLowerCase();
        const firstFourLettersOfLastName = this.firstname.slice(0, 2).toLowerCase();
        const birthYear = new Date(this.dateofbirth).getFullYear();
        return `${firstFourLettersOfFirstName}${firstFourLettersOfLastName}@${birthYear}`;
    };

    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.hashedPassword);
    };

    return User;
}