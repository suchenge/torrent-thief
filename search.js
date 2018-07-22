const process = require('process');
const Dictionary = require("./modules/dictionary");

const dict = new Dictionary();

const processArgv = process.argv.filter((arg, index) => (index > 1));
dict.appends(processArgv[0]);
console.log("done");