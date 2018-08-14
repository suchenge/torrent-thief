const process = require('process');
const Dictionary = require("./modules/dictionary");

const dict = new Dictionary(() => console.log("done"));
let path = "";

const processArgv = process.argv.filter((arg, index) => (index > 1));
if (processArgv[0]) path = processArgv[0];
else path = "N:\\写真\\0";
dict.appends(path, 0);
