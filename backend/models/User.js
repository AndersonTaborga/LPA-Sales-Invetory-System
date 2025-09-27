module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 50]
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 50]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer', 'employee'),
      allowNull: false,
      defaultValue: 'customer'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      }
    ]
  });
  return User;
};
