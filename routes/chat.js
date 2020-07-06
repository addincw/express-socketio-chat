const express = require('express')
const router = express.Router()

const formatter = require('../helpers/formater')

router.get('/', (request, response) => {
    const { username, group } = request.query
    const user = formatter.user(username)

    response.render('chat/index', { user, group })
})

module.exports = router