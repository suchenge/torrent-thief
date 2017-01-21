const fsExtra = require('fs-extra');
const path = require('path');

const Treasure = require('./modules/treasure/treasure');
const Box = require('./modules/treasure/box');
const Index = require('./modules/treasure/index');
const Builder = require('./modules/builder');

function replaceFolderName(name) {
    let str = name;
    str = removeSymbol(str)
    str = removeBlank(str);
    return str;
}

function removeBlank(name) {
    let str = name;
    return str.trim();
}

function removeSymbol(name) {
    let str = name;
    let splitArray = str.split('.');
    splitArray = splitArray.filter(line => (line != ''));
    return splitArray.join('.');
}

let treasure = new Treasure();

for (let categoryBox of treasure.listBox) {
    for (let dateBox of categoryBox.listBox) {
        for (let cupboardBox of dateBox.listBox) {
            newCupboardBoxName = replaceFolderName(cupboardBox.name)
            if (newCupboardBoxName != cupboardBox.name) {
                newCupboardBoxName = cupboardBox.address.replace(cupboardBox.name, newCupboardBoxName);
                if (fsExtra.existsSync(newCupboardBoxName)) {
                    newCupboardBoxName += '(1)';
                }
                fsExtra.renameSync(cupboardBox.address, newCupboardBoxName);
            }
        }
    }
}
console.log('done');