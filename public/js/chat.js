/* global moment, Mustache */

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

socket.on('connect', () => {
  socket.emit('join', params, err => {
    if (err) {
      window.alert(err)
      window.location.assign('/')
    }
  })
})

socket.on('disconnect', () => {
  console.log('Disconnected from server.')
})

socket.on('updateUserList', userList => {
  const ol = jQuery('<ol></ol>')

  userList.forEach(user => {
    ol.append(jQuery('<li></li>').text(user))
  })

  jQuery('#users').html(ol)
})

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#message-template').html()
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  })

  jQuery('#messages').append(html)
  scrollToBottom()
})

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#location-message-template').html()
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  })

  jQuery('#messages').append(html)
  scrollToBottom()
})

jQuery('#message-form').on('submit', e => {
  e.preventDefault()

  const messageTextbox = jQuery('[name=message]')

  socket.emit('createMessage', { text: messageTextbox.val() }, () => {
    messageTextbox.val('')
  })
})

const locationButton = jQuery('#send-location')
locationButton.on('click', e => {
  if (!navigator.geolocation) {
    return window.alert('Geolocation not supported by your browser.')
  }

  locationButton.prop('disabled', true).text('Sending Location...')

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })

      setTimeout(() => {
        locationButton.prop('disabled', false).text('Send Location')
      }, 3000)
    },
    () => {
      window.alert('Unable to fetch location.')
    }
  )
})
