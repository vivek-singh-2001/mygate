const { types } = require("pg");
const crypto = require("crypto");
const validator = require("validator");

module.exports = (connectDB, DataTypes) => {
  const User = connectDB.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 1111111,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateofbirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isMember: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName:'Users',
      hooks: {
        beforeCreate: async (user) => {
          if (!user.password) {
            const generatedPassword = user.generatePassword();
            console.log(generatedPassword);
            user.password = await encryptPassword(generatedPassword);
          } else {
            validatePassword(user.password);
            user.password = await encryptPassword(user.password);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            validatePassword(user.password);
            user.password = await encryptPassword(user.password);
            user.passwordChangedAt = Date.now();
          }
        },
      },
    }
  );
  User.prototype.generatePassword = function () {
    const firstFourLettersOfFirstName = this.firstname
      .slice(0, 2)
      .toLowerCase();
    const firstFourLettersOfLastName = this.firstname.slice(0, 2).toLowerCase();
    const birthYear = new Date(this.dateofbirth).getFullYear();
    return `${firstFourLettersOfFirstName}-${firstFourLettersOfLastName}@${birthYear}`;
  };

  User.prototype.validPassword = async function (password) {
    const encryptedPassword = await encryptPassword(password);
    return this.password === encryptedPassword;
  };

  User.prototype.isPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < passwordChangedTimestamp;
    }
    return false;
  };

  const encryptPassword = async (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
  };

  User.prototype.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
  };

  const validatePassword = (password) => {
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
  };

  return User;
};
