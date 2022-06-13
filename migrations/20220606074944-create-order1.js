'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            order_id: {
                type: Sequelize.STRING,
            },
            order_name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            txid: {
                type: Sequelize.STRING,
            },
            payment_method: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.DECIMAL,
            },
            amount_paid: {
                type: Sequelize.DECIMAL,
            },
            payment_status: {
                type: Sequelize.STRING,
            },
            payment_message: {
                type: Sequelize.TEXT,
            },
            order_status_url: {
                type: Sequelize.TEXT,
            },
            refund: {
                type: Sequelize.INTEGER,
            },
            refund_amount: {
                type: Sequelize.DECIMAL,
            },
            refund_status: {
                type: Sequelize.STRING,
            },
            refund_message: {
                type: Sequelize.TEXT,
            },
            mode: {
                type: Sequelize.INTEGER,
            },
            processed: {
                type: Sequelize.INTEGER,
            },
            store_id: {
                type: Sequelize.INTEGER,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface) {
        await queryInterface.dropTable('orders')
    },
}
