const expect = require('expect')

const { isRealString } = require('./validation')

describe('isRealString', () => {
  let input

  it('should reject non-string values', () => {
    input = 999
    expect(isRealString(input)).toBeFalsy()
  })

  it('should reject string with only spaces', () => {
    input = '        '
    expect(isRealString(input)).toBeFalsy()
  })

  it('should allow string with non-space characters', () => {
    input = '    Fine Wine    '
    expect(isRealString(input)).toBeTruthy()
  })
})
