const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

const app = express()
const server = http.Server(app)
const io = socketIO(server)
const users = new Users()

const publicPath = path.join(__dirname, '..', 'public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected.')

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room required')
    }

    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`))

    callback()
  })

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage: ', message)

    // io.emit('newMessage', generateMessage(message.from, message.text))
    io.to(message.room).emit('newMessage', generateMessage(message.from, message.text))

    callback()
    // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text))
  })

  socket.on('createLocationMessage', message => {
    io.to(message.room).emit(
      'newLocationMessage',
      generateLocationMessage(message.from, message.latitude, message.longitude)
    )
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`))
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
// course: express@4.14.0
// course: expect@1.20.2
// course: mocha@3.0.2
// course: nodemon@1.10.2
// course: moment@2.15.1
// course: mustache@2.2.1
