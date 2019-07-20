const testAddon = require('./build/Release/testaddon.node');

console.log(testAddon);
console.log('hello', testAddon.hello());
console.log('add', testAddon.add(1, 2));

module.exports = testAddon;
