const fs = require('fs');
const setting = require('./setting');

class Keyword {
    constructor() {
        this.filePath = setting.path.keyword;
    }
    get list() {
        let content = fs.readFileSync(this.filePath, 'utf8');
        return content.split('\r\n');
    }
    contain(title) {
        return this.list.some(domain => {
            return urlDomain == domain.trim();
        });
    }
}

module.exports = Keyword;