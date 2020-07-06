const moment = require('moment')

module.exports = {
    "user": function(username) {
        const join_at = moment().format('h:mm a')
        return { username, join_at }
    },
    "message": function(message, username='Bot') {
        const created_at = moment().format('h:mm a')
        return { username, message, created_at }
    }
}