const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '..', 'public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected.')

  socket.on('createMessage', newMessage => {
    console.log('createMessage: ', newMessage)

    io.emit('newMessage', {
      from: newMessage.from,
      text: newMessage.text,
      completedAt: new Date().getTime()
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
// course: express@4.14.0
