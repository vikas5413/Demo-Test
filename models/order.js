'use strict'
const { Model } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    order.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: DataTypes.STRING,
            order_name: DataTypes.STRING,
            email: DataTypes.STRING,
            txid: DataTypes.STRING,
            payment_method: DataTypes.STRING,
            amount: DataTypes.DECIMAL,
            amount_paid: DataTypes.DECIMAL,
            payment_status: DataTypes.STRING,
            payment_message: DataTypes.TEXT,
            order_status_url: DataTypes.TEXT,
            refund: DataTypes.INTEGER,
            refund_amount: DataTypes.DECIMAL,
            refund_status: DataTypes.STRING,
            refund_message: DataTypes.TEXT,
            mode: DataTypes.INTEGER,
            processed: DataTypes.INTEGER,
            store_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'order',
            tableName: 'orders',
            underscored: true,
        }
    )
    return order
}
