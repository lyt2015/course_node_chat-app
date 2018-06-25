// course : advanced goals
// 1. make chat room case insensitive
// 2. make user name unique
// 3. make all available rooms in the drop down list of join page

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

    users.removeUser(socket.id)
    const user = users.addUser(socket.id, params.name, params.room)
    if (!user) {
      return callback('This name has been used. Please choose another one.')
    }

    socket.join(user.room)

    io.to(user.room).emit('updateUserList', users.getUserList(user.room))

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    socket.broadcast
      .to(user.room)
      .emit('newMessage', generateMessage('Admin', `${user.name} has joined.`))

    callback()
  })

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id)

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
    }

    callback()
  })

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id)

    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      )
    }
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left the room.`)
      )
    }
  })

  socket.on('getRoomList', () => {
    socket.emit('sendRoomList', users.getRoomList())
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
