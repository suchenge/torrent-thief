const process = require('process');
const Disposal = require("./modules/disposal");

const processArgv = process.argv.filter((arg, index) => (index > 1));
let args = {
    path: processArgv.length > 0 && processArgv[0] ? processArgv[0] : "G:\\Game\\VR-JAV PACK",
}
console.log(args.path);
new Disposal(args.path).run(() => console.log("done"));