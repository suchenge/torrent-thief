const fsExtra = require('fs-extra');
const path = require('path');

const Treasure = require('./modules/treasure/treasure');
const Box = require('./modules/treasure/box');
const Index = require('./modules/treasure/index');
const Builder = require('./modules/builder');

let treasure = new Treasure();

function renameFile(fileName) {
    let str = fileName;
    if (str.endsWith('.')) {
        str += 'jpg';
    }
    return str;
}
let newFileName;
for (let categoryBox of treasure.listBox) {
    for (let dateBox of categoryBox.listBox) {
        for (let cupboardBox of dateBox.listBox) {
            for (let fileBox of cupboardBox.list.filter(box => (!box.isDir))) {
                newFileName = renameFile(fileBox.name);
                if (newFileName != fileBox.name) {
                    console.log(newFileName);
                    console.log(fileBox.name);
                    newFileName = fileBox.address.replace(fileBox.name, newFileName);
                    if (fsExtra.existsSync(newFileName)) {
                        newFileName += '(1)';
                    }
                    console.log(newFileName);
                    console.log(fileBox.name);
                    fsExtra.removeSync(fileBox.name, newFileName);
                }
            }
        }
    }
}
console.log('done');