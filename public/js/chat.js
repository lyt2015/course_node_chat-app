const socket = io()

const params = jQuery.deparam(window.location.search)

function scrollToBottom() {
  // Selectors
  const messages = jQuery('#messages')
  const newMessage = messages.children('li:last-child')
  // Heights
  const scrollTop = messages.prop('scrollTop')
  const clientHeight = messages.prop('clientHeight')
  const scrollHeight = messages.prop('scrollHeight')
  const newMessageHeight = newMessage.innerHeight()
  const lastMessageHeight = newMessage.prev().innerHeight()

  // console.log('==========================')
  // console.log(scrollTop)
  // console.log(clientHeight)
  // console.log(scrollHeight)
  // console.log(lastMessageHeight)
  // console.log(newMessageHeight)

  if (scrollTop + clientHeight + lastMessageHeight * 2 + newMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', function() {
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('No error')
    }
  })
})

socket.on('disconnect', function() {
  console.log('Disconnected from server.')
})

socket.on('updateUserList', function(userList) {
  const ol = jQuery('<ol></ol>')

  userList.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user))
  })

  jQuery('#users').html(ol)
})

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#message-template').html()
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html)
  scrollToBottom()
})

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#location-message-template').html()
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html)
  scrollToBottom()
})

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()

  const messageTextbox = jQuery('[name=message]')

  socket.emit(
    'createMessage',
    {
      from: params.name,
      room: params.room,
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
        from: params.name,
        room: params.room,
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
