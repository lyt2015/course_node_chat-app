const expect = require('expect')

const { generateMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Zin'
    const text = 'This is a test message'

    const message = generateMessage(from, text)

    expect(message).toEqual(expect.objectContaining({ from, text }))
    expect(message.completedAt).toEqual(expect.any(Number))
  })
})
