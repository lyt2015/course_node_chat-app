const expect = require('expect')

const { Users } = require('./users')

describe('Users', () => {
  let users

  beforeEach(() => {
    users = new Users()
    users.users = [
      { id: '001', name: 'Zin', room: 'Earth' },
      { id: '002', name: 'Mary', room: 'Earth' },
      { id: '003', name: 'Lisa', room: 'Earth' },
      { id: '004', name: 'Mike', room: 'Moon' },
      { id: '005', name: 'Dean', room: 'Moon' }
    ]
  })

  it('should add new user', () => {
    const user = {
      id: '123',
      name: 'Mary',
      room: 'Earth'
    }

    const resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual(expect.arrayContaining([user]))
    expect(resUser).toEqual(user)
  })

  it('should remove a user', () => {
    const id = '005'
    const length = users.users.length

    const user = users.removeUser(id)

    expect(user.id).toBe(id)
    expect(users.users.length).toBe(length - 1)
  })

  it('should not remove a user', () => {
    const id = '999'
    const length = users.users.length

    const user = users.removeUser(id)

    expect(user).toBeUndefined()
    expect(users.users.length).toBe(length)
  })

  it('should find a user', () => {
    const id = '002'

    const user = users.getUser(id)

    expect(user).toEqual({ id: '002', name: 'Mary', room: 'Earth' })
  })

  it('should not find any user', () => {
    const id = '999'

    const user = users.getUser(id)

    expect(user).toBeUndefined()
  })

  it('should return users in room Earth', () => {
    const userList = users.getUserList('Earth')

    expect(userList).toEqual(expect.arrayContaining(['Lisa', 'Mary', 'Zin']))
  })

  it('should return users in room Moon', () => {
    const userList = users.getUserList('Moon')

    expect(userList).toEqual(expect.arrayContaining(['Mike', 'Dean']))
  })
})
