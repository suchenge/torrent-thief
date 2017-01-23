const commander = require('commander');
const Thielf = require('./modules/thief');
const process = require('process');

const processArgv = process.argv.filter((arg, index) => (index > 1));
let args = {
    number: processArgv.length > 0 && processArgv[0] ? processArgv[0] : 230,
    toDate: processArgv.length > 0 && processArgv[1] ? processArgv[1] : null,
    count: processArgv.length > 0 && processArgv[2] ? processArgv[2] : 1
}
console.log(args);
new Thielf().pilfer(args.number, args.toDate, args.count);
console.log('done');