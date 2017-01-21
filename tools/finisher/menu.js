const fsExtra = require('fs-extra');
const path = require('path');

const datehelper = require('../modules/utility/date');
const Treasure = require('../modules/treasure');

let categoryBoxMenu, dateBoxMenu, menuDate;
for (let categoryBox of new Treasure().listBox) {
    categoryBoxMenu = categoryBox.menu;
    for (let index of categoryBoxMenu.list) {
        menuDate = datehelper.formate(index.date);
        dateBoxMenu = categoryBox.getChild(menuDate);
        dateBoxMenu.menu.append(index);
    }
}
console.log('done');