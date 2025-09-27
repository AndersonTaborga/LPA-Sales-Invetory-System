module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
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
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'orders',
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

  return Order;
};
