const formatter = require('../helpers/formater')

let users = []

module.exports = {
	"create": function(id, username, group) {
		const user = formatter.user(id, username, group)

		users.push(user)
		return users.find((user) => user.id === id)
	},
	"delete": function(id) {
		const userIndex = users.findIndex((user) => user.id === id)

		if(userIndex === -1) return

		return users.splice(userIndex, 1)[0]
	},
	"get": function(group) {
		return users.filter((user) => user.group == group)
	},
	"find": function(id) {
		return users.find((user) => user.id === id)
	}
}