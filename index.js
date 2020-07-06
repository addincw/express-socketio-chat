const PORT = process.env.PORT || 3000

const http = require('http')
const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const socketio = require('socket.io')

const formatter = require('./helpers/formater')

const mUser = require('./models/user')

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
    let username = 'Bot'

    socket.on('group:join', ({user, group}) => {        
        user = mUser.create(socket.id, user.username, group)
        userList = mUser.get(group)

        socket.join(group)

        /** event emitter */
        //emmit event only for current connection
        socket.emit('message:in', formatter.message(username, 'welcome to socketio-chat'))
        //emmit event except current connection
        socket.broadcast
                .to(group)
                .emit('message:in', formatter.message(username, `${user.username} has join the chat`))
        //emmit event to all connection
        ws.to(group).emit('user:list', userList)

        /** event listener */
        socket.on('message:out', (msg) => {
            let { username, message } = msg
            
            socket.broadcast
                    .to(group)
                    .emit('message:in', formatter.message(username, message))
        })
        socket.on('disconnect', () => {
            console.log(`called`)
            const user =  mUser.delete(socket.id)

            socket.broadcast
                    .to(group)
                    .emit('message:in', formatter.message(username, `${user.username} has left the chat`))

            ws.to(group).emit('user:list', mUser.get(group))
        })
    })

    /** event emitter */
    // //emmit event except current connection
    // socket.broadcast.emit('message:in', formatter.message(username, 'user has join the chat'))
    // //emmit event only for current connection
    // socket.emit('message:in', formatter.message(username, 'welcome to socketio-chat'))
    // //emmit event to all connection

    /** event listener */
    // socket.on('user:in', (user) => {
    //     socket.broadcast.emit('user:in', user)
    // })
    // socket.on('message:out', (msg) => {
    //     const { username, message } = msg
    //     socket.broadcast.emit('message:in', formatter.message(username, message))
    // })
    // socket.on('disconnect', () => {
    //     socket.broadcast.emit('message:in', formatter.message(username, 'user has left the chat'))
    // })
})

server.listen(PORT, () => console.log(`server is running on port : ${PORT}`))