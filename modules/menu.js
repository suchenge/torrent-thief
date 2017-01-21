const fs = require('fs');
const setting = require('./setting');

class Menu {
    constructor(address) {
        this.addressPath = address + '\\' + setting.menu.name;
    }
    contain(index) {
        let result = false;
        let list = [];
        list = this.list;
        if (list.length != 0) {
            result = list.some(line => {
                return JSON.stringify(line) == JSON.stringify(index);
            });
        }
        list = null;
        return result;
    }
    get list() {
        let list = [];
        if (fs.existsSync(this.addressPath)) {
            let content = fs.readFileSync(this.addressPath, 'utf8');
            if (content) {
                content = `[${content}]`;
                list = JSON.parse(content);
                content = null;
            }
        }
        return list;
    }
    append(index) {
        let json = JSON.stringify(index, null, 4);

        if (this.list.length == 0) {
            fs.appendFileSync(this.addressPath, `${json}`);
        } else if (!this.contain(index)) {
            fs.appendFileSync(this.addressPath, `${setting.menu.splitSymbol}${json}`);
        }
    }
}

module.exports = Menu;