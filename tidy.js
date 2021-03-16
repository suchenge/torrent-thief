const process = require('process');
const Disposal = require("./modules/disposal");

const processArgv = process.argv.filter((arg, index) => (index > 1));
let args = {
    path: processArgv.length > 0 && processArgv[0] ? processArgv[0] : "E:\\Temp\\Done",
};
console.log(args.path);

(
    async(path) => {
        let disposal = new Disposal(path);
        await disposal.run();
    }
)(args.path);