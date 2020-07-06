const PORT = process.env.PORT || 3000

const http = require('http')
const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const socketio = require('socket.io')

const formatter = require('./helpers/formater')

const app = express()
const server = http.createServer(app)
const ws = socketio(server)

//set template engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

//handle request.body
app.use(express.urlencoded({ extended: false }))

app.use((request, response, next) => {
    response.locals.base_url = '.'
    next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'node_modules')))

app.use('/auth', require('./routes/auth'))
app.use('/chat', require('./routes/chat'))

//websocket handler
ws.on('connection', (socket) => {
    /** event emitter */
    //emmit event except current connection
    socket.broadcast.emit('message:in', formatter.message('user has join the chat'))
    //emmit event only for current connection
    socket.emit('message:in', formatter.message('welcome to socketio-chat'))
    //emmit event to all connection

    /** event listener */
    socket.on('user:in', (user) => {
        socket.broadcast.emit('user:in', user)
    })
    socket.on('message:out', (msg) => {
        const { username, message } = msg

        socket.broadcast.emit('message:in', formatter.message(message, username))
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('message:in', formatter.message('user has left the chat'))
    })
})

server.listen(PORT, () => console.log(`server is running on port : ${PORT}`))