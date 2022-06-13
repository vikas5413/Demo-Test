const models = require('../models')

module.exports.controller = function (app) {
    app.get('/configuration/index/:id', async (req, res) => {
        var store_id = req.params.id
        var configuration = await models.Configuration.findOne({
            where: { store_id },
        })
        var store = await models.Store.findOne({
            where: { id: store_id },
        })
        if (!configuration) {
            configuration = {
                store_id,
                mode: 0,
                api_key: '',
                api_secret: '',
            }
        }
        var host = Buffer.from(`${store.url}/admin`).toString('base64')
        res.render('configuration/index', {
            configuration,
            host: JSON.stringify(host),
        })
    })

    app.post('/configuration/create', async (req, res) => {
        const { api_key, api_secret, mode, store_id } = req.body

        var configuration = await models.Configuration.findOne({
            where: { store_id },
        })
        try {
            if (configuration) {
                await models.Configuration.update(
                    {
                        api_key,
                        api_secret,
                        store_id,
                        mode: mode === 'on' ? 1 : 0,
                    },
                    {
                        where: { id: configuration.id },
                    }
                )
            } else {
                await models.Configuration.create({
                    api_key,
                    api_secret,
                    store_id,
                    mode: mode === 'on' ? 1 : 0,
                })
            }
        } catch (errr) {
            return res.redirect('/error-page')
        }
        return res.redirect('/configuration/index/' + store_id)
    })

    app.get('/error-page', async (req, res) => {
        res.render('configuration/error')
    })
}
