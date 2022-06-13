const express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    fs = require('fs'),
    cors = require('cors'),
    app = express(),
    models = require('./models')

const { Op } = require('sequelize')
const { Shopify } = require('@shopify/shopify-api')
const port = 3005

require('dotenv').config()

// Parse application/x-www-form-urlencoded
app.locals.api_key = process.env.SHOPIFY_API_KEY

app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// View Template Engine
app.set('view engine', 'pug')

// App session
app.use(
    session({
        secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
        cookie: {
            path: '/',
            httpOnly: false,
            expires: new Date(Date.now() + 60000),
            maxAge: 60000,
        },
        resave: true,
        saveUninitialized: true
    })
)

// Shopify App Initialization
Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES,
    HOST_NAME: process.env.HOST,
    API_VERSION: process.env.SHOPIFY_API_VERSION,
    IS_EMBEDDED_APP: true,
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
})

const handleWebhookRequest = async (topic, shop) => {
    if(topic === 'APP_UNINSTALLED') {
        await models.Store.update({
                password: '',
                deleted_at: Date.now()
            }, {
            where: {
                url: shop
            }
        })
    }
}

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: handleWebhookRequest
})

fs.readdirSync('./controllers').forEach(function (file) {
    if (file !== 'api') {
        fs.readdirSync('./controllers/').forEach(function (file) {
            if (file.substr(-3) == '.js') {
                var api = require('./controllers/' + file)
                api.controller(app, Shopify, Op)
            }
        })
    }
})

app.listen(port)
