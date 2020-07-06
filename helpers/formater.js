const moment = require('moment')

module.exports = {
    "user": function(id, username, group) {
        const join_at = moment().format('h:mm a')
        return { id, username, group, join_at }
    },
    "message": function(username, message) {
        const created_at = moment().format('h:mm a')
        return { username, message, created_at }
    }
}