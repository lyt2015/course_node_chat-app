const moment = require('moment')

const generateMessage = (from, text) => {
  return {
    from,
    text,
    completedAt: moment().valueOf()
  }
}

const generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    completedAt: moment().valueOf()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}
