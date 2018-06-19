const generateMessage = (from, text) => {
  return {
    from,
    text,
    completedAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage
}
