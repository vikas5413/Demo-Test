'use strict'
const { Model } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Configuration extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    Configuration.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            store_id: DataTypes.INTEGER,
            mode: { type: Sequelize.ENUM, values: ['0', '1'] },
            api_key: DataTypes.STRING,
            api_secret: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Configuration',
            tableName: 'configurations',
            underscored: true,
        }
    )
    return Configuration
}
