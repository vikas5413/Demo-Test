const models = require('../models')
const request = require('request-promise')
const superagent = require('superagent')
require('dotenv').config()
const api_version = process.env.SHOPIFY_API_VERSION

module.exports.controller = function (app) {
    // get order
    app.get('/get-order/:order_id/:shop', async (req, res) => {
        var order_id = req.params.order_id
        var shop_name = req.params.shop
        try {
            var order = await models.order.findOne({
                where: { order_id: order_id },
            })
            if (!order) {
                var shop = await models.Store.findOne({
                    where: { url: shop_name },
                })
                if (shop) {
                    const accessToken = shop.password
                    const shopRequestURL =
                        'https://' +
                        shop_name +
                        '/admin/api/' +
                        api_version +
                        '/orders/' +
                        order_id +
                        '.json'
                    const shopRequestHeaders = {
                        'X-Shopify-Access-Token': accessToken,
                    }
                    request
                        .get(shopRequestURL, { headers: shopRequestHeaders })
                        .then(async (shopResponse) => {
                            const order_response =
                                JSON.parse(shopResponse).order
                            const email = order_response.email
                            const order_status_url =
                                order_response.order_status_url
                            const processing_method =
                                order_response.processing_method
                            const order_placed = await models.order.create({
                                order_id: order_id,
                                order_name: order_response.name,
                                amount: order_response.total_price,
                                email,
                                payment_status: order_response.financial_status,
                                payment_method: processing_method,
                                order_status_url,
                                mode: 1,
                                processed: 0,
                                store_id: shop.id,
                            })
                            if (order_placed) {
                                return res.send({
                                    status: true,
                                    gateway: 'atoa',
                                    financial_status:
                                        order_response.financial_status,
                                })
                            } else {
                                return res.send({ status: false })
                            }
                        })
                        .catch(() => {
                            return res.redirect('/error-page')
                        })
                }
            } else {
                return res.send({
                    status: false,
                    gateway: order.payment_method,
                    financial_status: order.payment_status,
                })
            }
        } catch (e) {
            return res.redirect('/error-page')
        }
    })

    //processed api
    app.get('/processed/:order_id', async (req, res) => {
        var order_id = req.params.order_id
        try {
            var process = await models.order.findOne({
                where: { order_id: order_id, processed: 0 },
            })
            if (process) {
                return res.send({ status: true })
            } else {
                return res.send({ status: false })
            }
        } catch (e) {
            return res.redirect('/error-page')
        }
    })

    app.get('/processing/:order_id/:shop', async (req, resp) => {
        var order_id = req.params.order_id
        try {
            var order = await models.order.findOne({
                where: { order_id: order_id },
            })
            superagent
                .post(process.env.PAYMENT_PROCESS_URL)
                .send({
                    customerId: 'fghrytghfgh',
                    orderId: order_id,
                    amount: order.amount,
                    currency: 'GBP',
                    institutionId: process.env.ATOA_INSTITUTIONID,
                    paymentType: 'DOMSETIC',
                    autoRedirect: true,
                    consumerDetails: {
                        phoneCountryCode: '91',
                        phoneNumber: '56454231',
                        email: 'shvii@test.com',
                        firstName: 'test',
                        lastName: 'dfg',
                    },
                })
                // sends a JSON post body
                .set('Authorization', 'Bearer ' + process.env.PAYMENT_API_TOKEN)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    resp.redirect(process.env.PAYMENT_LINK + res.req.path)
                })
        } catch (e) {
            return resp.redirect('/error-page')
        }
    })
}
