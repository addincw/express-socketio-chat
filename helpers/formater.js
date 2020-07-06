const moment = require('moment')

function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

module.exports = {
    "user": function(id, username, group) {
        const join_at = moment().format('h:mm a')
        return { 
            id, 
            username,
            color: getRandomColor(), 
            group, 
            join_at 
        }
    },
    "message": function(username, message, color='') {
        const created_at = moment().format('h:mm a')
        return { username, color, message, created_at }
    }
}