
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please provide a valid email',
        },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } });
          if (user && user.userId !== this.userId) {
            throw new Error('Email already exists');
          }
        },
      },
    },
    gender: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    agreed_to_terms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isTrue(value) {
          if (!value) {
            throw new Error('You must agree to the terms and conditions');
          }
        },
      },
    },
    role: {
      type: DataTypes.STRING(1),
      defaultValue: '0',
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: "users",
  });

  // Function to ensure the super admin exists
  const ensureSuperAdminExists = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('QASuperAdmin@524334', salt);

    await User.findOrCreate({
      where: { email: "superAdmin@admin.com" },
      defaults: {
        username: "superAdmin",
        firstname: "superAdmin",
        lastname: "superAdmin",
        email: "superAdmin@admin.com",
        gender: "male",
        country: "Ethiopia",
        agreed_to_terms: true,
        role: '3',
        password: hashedPassword,
      },
    });
  };

  // Hook to ensure the super admin exists after the User model is synchronized
  sequelize.sync().then(() => {
    ensureSuperAdminExists()
      .then(() => console.log(""))
      .catch(err => console.error("Error ensuring super admin:", err));
  });

  return User;
};
