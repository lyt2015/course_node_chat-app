const socket = io()

socket.on('connect', function() {
  console.log('Connected to server.')
})

socket.on('disconnect', function() {
  console.log('Disconnected from server.')
})

socket.on('newMessage', function(message) {
  // console.log('newMessage: ', message)

  const li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`)
  jQuery('#messages').append(li)
  // jQuery('#messages').append('<li>' + message.text + '</li>')
})

socket.on('newLocationMessage', function(message) {
  const li = jQuery('<li></li>')
  const a = jQuery('<a target="_blank">My current location</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)

  li.append(a)

  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()

  const messageTextbox = jQuery('[name=message]')

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val('')
    }
  )
})

const locationButton = jQuery('#send-location')
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.')
  }

  locationButton.prop('disabled', true).text('Sending Location...')

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })

      setTimeout(function() {
        locationButton.prop('disabled', false).text('Send Location')
      }, 3000)
    },
    function() {
      alert('Unable to fetch location.')
    }
  )
})
