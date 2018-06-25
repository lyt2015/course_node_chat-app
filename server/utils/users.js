class Users {
  constructor() {
    this.users = []
    this.rooms = []
  }

  addUser(id, name, room) {
    if (isExistingUser(name, this.users)) {
      return null
    }

    room = checkIn(room, this.rooms)

    const user = { id, name, room }

    this.users.push(user)
    return user
  }

  removeUser(id) {
    const user = this.getUser(id)

    if (user) {
      this.users = this.users.filter(user => user.id !== id)
      checkOut(user, this.users, this.rooms)
    }

    return user
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0]
  }

  getUserList(room) {
    const roomUsers = this.users.filter(user => user.room === room)

    const userList = roomUsers.map(user => user.name)

    return userList
  }

  getRoomList() {
    return this.rooms
  }
}

const isExistingUser = (name, users) => {
  return users.find(user => {
    return user.name.toLowerCase() === name.toLowerCase()
  })
}
const checkIn = (room, rooms) => {
  const roomFound = rooms.find(ele => ele.trim().toLowerCase() === room.trim().toLowerCase())

  if (roomFound) {
    return roomFound
  } else {
    room = room.trim()
    rooms.push(room)
    return room
  }
}

const checkOut = (user, users, rooms) => {
  const roommate = users.find(ele => ele.room === user.room)

  if (!roommate) {
    rooms = rooms.filter(ele => ele != user.room)
  }
}

module.exports = {
  Users,
}
