const fs = require('fs');
const parseDomain = require('parse-domain')
const setting = require('./setting');

function getDomain(url) {
    let domain = parseDomain(url);
    if (domain) return [domain.domain, domain.tld].join('.');
    return null;
}

class BlackDomain {
    constructor() {
        this.filePath = setting.path.blackDomain;
    }
    get list() {
        let content = fs.readFileSync(this.filePath, 'utf8');
        return content.split('\r\n');
    }
    contain(url) {
        let inWhiteDomain = setting.whiteDomain.some(domain => {
            return url.includes(domain);
        });
        if (inWhiteDomain) return false;
        let urlDomain = getDomain(url);
        return this.list.some(domain => {
            return urlDomain == domain.trim();
        });
    }
    append(url) {
        //if (url.includes('67.220.93.4')) return;
        //if (!this.contain(url)) {
        //    fs.appendFileSync(this.filePath, '\r\n' + getDomain(url));
        //}
    }
}

module.exports = BlackDomain;