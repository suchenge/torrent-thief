const dependentModules = [
    'iconv-lite',
    'sync-request',
    'cheerio',
    'parse-domain',
    'colors',
    'urlencode2',
    'commander'
];

let moduleObj, needSetup;
let process = require('child_process');
for (let module of dependentModules) {
    try {
        moduleObj = require(module);
        if (!moduleObj) {}
    } catch (ex) {
        needSetup = true;
        process.execSync('npm install -g ' + module);
    }
}
if (needSetup) console.log('setup done.');