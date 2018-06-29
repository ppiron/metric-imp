module.exports = function evaluate(str) {
  if (str === '') {
    return 1.0;
  }
  if (str.split('').some( c => {
    return !c.match(/[0-9./]/)
  })) {
    return 'invalid number'
  }
  const dots = str.split('').filter(c => {
    return c === '.'
  }).length
  const slash = str.split('').filter(c => {
    return c === '/'
  }).length
  const nums = str.split('').filter(c => {
    return c.match(/[0-9]/) 
  }).length
  if (nums === 0) {
    return 'invalid number'
  }
  if (dots > 2 || slash > 1) {
    return 'invalid number'
  }
  if (str.match(/\.\./)) {
    return 'invalid number'
  }
  if (str.match(/^0\d/)) {
    return 'invalid number'
  }
  if (slash === 0) {
    return parseFloat(str)
  }
  if (str.match(/[^\/]\/0\d/)) {
    return 'invalid number'
  }
  const [a, b] = str.split('/')
  return parseFloat(a) / parseFloat(b)
}