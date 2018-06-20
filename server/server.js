const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '..', 'public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected.')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage: ', message)

    io.emit('newMessage', generateMessage(message.from, message.text))

    callback()
    // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text))
  })

  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
// course: express@4.14.0
// course: expect@1.20.2
// course: mocha@3.0.2
// course: nodemon@1.10.2
