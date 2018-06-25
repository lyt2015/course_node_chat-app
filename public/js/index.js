const socket = io()

socket.on('connect', () => {
  socket.emit('getRoomList')
})

socket.on('sendRoomList', roomList => {
  const htmlRoomList = jQuery('#room-list')
  console.log(roomList)

  roomList.forEach(room => {
    htmlRoomList.append(jQuery('<option></option>').text(room))
  })
})
