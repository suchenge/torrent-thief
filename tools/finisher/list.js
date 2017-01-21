const fsExtra = require('fs-extra');
const path = require('path');

const Treasure = require('./modules/treasure/treasure');
const Box = require('./modules/treasure/box');
const Index = require('./modules/treasure/index');
const Builder = require('./modules/builder');


let treasure = new Treasure();
let newTreasure = new Box(path.resolve('')).append('newtreasures');
let newCategoryBox, newDateBox, cupboardIndex, cupboardFiles, cupboard;
let oldAddress, newAddress;

function isPic(fileName) {
    let fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    let suffix = ['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'];
    return suffix.includes(fileSuffix.toLocaleUpperCase());
}

function fileSuffix(fileName) {
    return fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
}

for (let dateBox of treasure.listBox) {
    for (let categoryBox of dateBox.listBox) {
        newCategoryBox = newTreasure.append(categoryBox.name);
        newDateBox = newCategoryBox.append(dateBox.name);
        for (let cupboardBox of categoryBox.listBox) {
            cupboardIndex = dateBox.menu.filter(cupboardBox.name);
            if (cupboardIndex) {
                newCategoryBox.newMenu.append(cupboardIndex.new);
                cupboardBox.menu.append(cupboardIndex);
                cupboardFiles = cupboardBox.list.filter(file => isPic(file.address)).map(file => fileSuffix(file.address));
                if (!cupboardFiles || cupboardFiles.length <= 0) {
                    cupboard = Builder.cupboard(cupboardIndex.link);
                    for (let file of cupboard.files) {
                        cupboardBox.menu.append(new Index(file.name, file.link, '', ''));
                    }
                }
            }
        }
        newAddress = newDateBox.address;
        oldAddress = categoryBox.address;
        cupboard = null;
        cupboardFiles = null;
        cupboardIndex = null;
        newCategoryBox = null;
        newDateBox = null;
        fsExtra.copySync(oldAddress, newAddress);
    }
}
console.log('done');