'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('configurations', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            store_id: {
                type: Sequelize.INTEGER,
            },
            mode: {
                type: Sequelize.ENUM,
                values: ['0', '1'],
            },
            api_key: {
                type: Sequelize.STRING,
            },
            api_secret: {
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface) {
        await queryInterface.dropTable('configurations')
    },
}
