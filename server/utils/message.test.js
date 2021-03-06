const expect = require('expect')

const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Zin'
    const text = 'This is a test message'

    const message = generateMessage(from, text)

    expect(message).toEqual(expect.objectContaining({ from, text }))
    expect(message.createdAt).toEqual(expect.any(Number))
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Zin'
    const latitude = 45 // range from -90 to 90
    const longitude = 90 //range from -180 to 180
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`

    const locationMessage = generateLocationMessage(from, latitude, longitude)

    expect(locationMessage).toEqual(expect.objectContaining({ from, url }))
    expect(locationMessage.createdAt).toEqual(expect.any(Number))
  })
})

describe('trial test cases', () => {
  it('should pass these trial cases', () => {
    expect(undefined).toBeUndefined()
    expect(null).toBeDefined()

    expect(['coke', 'cookie', 'iphone 4: $599']).toEqual([
      expect.stringContaining('ke'),
      expect.stringMatching(/oo/),
      expect.stringMatching(/\d{3}/)
    ])
  })
})
