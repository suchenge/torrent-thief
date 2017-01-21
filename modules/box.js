const fs = require('fs');
const request = require('./utility/syncRequest');
const menu = require('./menu');

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

function replaceBadFileName(name) {
    let str = name;
    str = str.replace(/\?/g, '');
    str = str.replace(/\:/g, '');
    str = str.replace(/\*/g, '');
    str = str.replace(/\"/g, '');
    str = str.replace(/\</g, '');
    str = str.replace(/\>/g, '');
    str = str.replace(/\\/g, '');
    str = str.replace(/\//g, '');
    str = str.replace(/\|/g, '');
    str = str.replace(/\./g, '');
    return replaceFolderName(str);
}

class Box {
    constructor(address) {
        this.address = address;
        this.menu = new menu(address);
    }
    create() {
        if (!fs.existsSync(this.address)) {
            fs.mkdirSync(this.address)
        }
    }
    append(name) {
        let newAddress = this.address + '\\' + replaceBadFileName(name);
        let newBox = new Box(newAddress);
        if (!fs.existsSync(newAddress)) newBox.create();
        return newBox;
    }
    saveFile(fileName, fileLink) {
        let data = request.getFile(fileLink);
        if (data != null) {
            fs.writeFileSync(`${this.address}\\${fileName}`, data);
            data = null;
            return true;
        } else return false;
    }
    get isDir() {
        return fs.lstatSync(this.address).isDirectory();
    }
    get name() {
        return this.address.substring(this.address.lastIndexOf('\\') + 1, this.address.length);
    }
    get list() {
        return fs.readdirSync(this.address).map(file => { return new Box(`${this.address}\\${file}`) })
            .sort((left, right) => {
                return left.date < right.date ? 1 : (left.date > right.date ? -1 : 0);
            });
    }
    get listBox() {
        return this.list.filter(box => box.isDir);
    }
    get date() {
        return Date.parse(this.name);
    }
    contain(box) {
        let result = false;
        let list = this.list;
        if (list.length > 0) {
            result = list.some(b => { return b.name == box.name });
        }
        list = null;
        return result;
    }
    getChild(name) {
        let box = new Box(`${this.address}\\${replaceBadFileName(name)}`);
        if (this.contain(box)) return box;
        else return this.append(name);
    }
}

module.exports = Box;