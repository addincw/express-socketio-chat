const express = require('express')
const router = express.Router()

router.get('/login', (request, response) => {
    const groups = ['PHP', 'Javascript', 'Python', 'Ruby']
    
    response.locals.base_url = '..'

    response.render('auth/login', { groups })
})

module.exports = router