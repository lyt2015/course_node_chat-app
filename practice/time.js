const moment = require('moment')

const now = moment()
const valueOfNow = now.valueOf()

console.log(valueOfNow)

console.log(now.format('YYYY-MMM-Do'))

console.log(now.format('h:mm a'))

/*
console.log(now)

console.log('======================')
console.log(now.format())

console.log('======================')
console.log(now.format('MMM'));

console.log('======================')
console.log(now.format('MMM YYYY'));

console.log('======================')
console.log(now.format('MMM Do, YYYY'));

console.log('======================')
console.log(now.add(300, 'years').format('MMM Do, YYYY'));

console.log('======================')
console.log(now.subtract(10, 'months').format('MMM Do, YYYY'));

console.log('======================')
console.log(now.format('MMM Do, YYYY'));
*/
