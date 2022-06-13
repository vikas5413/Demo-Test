const models = require('../models')
require('dotenv').config()

module.exports.controller = function (app, Shopify, Op) {

    app.get('/auth', async (req, res) => {

        const shop = req.query.shop
        if (!shop) {
            return res.status(400).send('Missing "Shop Name" parameter!!')
        }

        // Find is store already existing as user
        const store = await models.Store.findOne({
            where: {
                url: shop,
                password: { [Op.ne]: '' }
            },
        })

        // App is already installed
        if (store) {
            req.session.user = shop
            return res.redirect('/configuration/index/' + store.id)
        }

        // Generate token and install app after authorization
        if (!store && shop) {
            // Install URL for app install
            const authRoute = await Shopify.Auth.beginAuth(
                req,
                res,
                req.query.shop,
                '/auth/callback',
                true,
            );
            return res.redirect(authRoute);
        }

        res.status(400).send('Invalid Request')
    })

    app.get('/auth/callback', async (req, res) => {
        try {
            const currentSession = await Shopify.Auth.validateAuthCallback(
                req,
                res,
                req.query
            )
            const { accessToken, shop, onlineAccessInfo } = currentSession

            // Register webhook for uninstall
            await Shopify.Webhooks.Registry.register({
                path: `/webhooks`,
                topic: 'APP_UNINSTALLED',
                accessToken: currentSession.accessToken,
                shop: req.query.shop,
            })

            // Save data in database
            var store = await models.Store.findOne({
                where: {
                    url: shop,
                },
            })
            // App is already installed
            if (store) {
                await models.Store.update({
                    password: accessToken,
                    deleted_at: new Date()
                }, {
                    where: {
                        url: shop
                    }
                })
            } else {
                store = await models.Store.create({
                    name: shop,
                    url: shop,
                    email: onlineAccessInfo.associated_user.email,
                    password: accessToken
                })
            }

            return res.redirect('/configuration/index/' + store.id)

        } catch (error) {
            res.status(400).send('Required parameters missing')
        }
    })

    app.post('/webhooks', async (req, res) => {
        try {
            await Shopify.Webhooks.Registry.process(req, res)
        } catch (error) {
            res.render('configuration/error')
        }
    })
}
