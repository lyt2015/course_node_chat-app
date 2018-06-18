const socket = io()

socket.on('connect', function() {
  console.log('Connected to server.')

  socket.emit('createMessage', {
    to: 'Mary',
    text: 'Indeed, that looks great.'
  })
})

socket.on('disconnect', function() {
  console.log('Disconnected from server.')
})

socket.on('newMessage', function(message) {
  console.log('newMessage: ', message)
})
