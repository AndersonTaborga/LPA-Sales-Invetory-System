module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    customer_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'sales',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      }
    ]
  });
  return Sales;
}; 