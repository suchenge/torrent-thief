const process = require('process');
const Dictionary = require("./modules/dictionary");

const dict = new Dictionary(() => console.log("done"));
let path = "";

const processArgv = process.argv.filter((arg, index) => (index > 1));
if (processArgv[0]) path = processArgv[0];
else path = "E:\\temp.0\\Document";
dict.appends(path, "Temp.2018", 0);
