const fs = require('fs');
const colors = require("colors");
const setting = require('../setting');
const dateHelper = require('./date');

let write = function(message, link, html = null, ex = null) {
    let date = Date.now();
    date = dateHelper.formate(date, 'yyyy-MM-dd hh:mm:ss')
    let fileName = dateHelper.formate(date, 'yyyyMMdd');
    let content = `date:${date}\r\n`;
    content += `message:${message}\r\n`;
    content += `link:${link}\r\n`;
    if (ex != null) {
        content += `${ex.name}\r\n`;
        content += `${ex.message}\r\n`;
        content += `${ex.stack}\r\n`;
    }
    if (html != null) content += `${html}\r\n`;
    content += '-----------------------------------------------\r\n';
    fs.appendFileSync(`${setting.path.log}\\${fileName}.log`, content);
};

module.exports.write = write;