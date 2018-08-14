const cheerio = require('cheerio');
const setting = require('./setting');
const log = require('./utility/log');
const request = require('./utility/syncRequest');

function roomNextList(link) {
    let regEx = /-(\d+)\.html/gi;
    let regMatch = regEx.exec(link);
    let suffix = regMatch[0];
    let index = parseInt(regMatch[1]);
    let newSuffix = suffix.replace(index, index + 1);
    return link.replace(suffix, newSuffix);
}

function buildRoomLink(currentLink, nextIndex) {
    let regEx = /-(\d+)\.html/gi;
    let regMatch = regEx.exec(currentLink);
    let suffix = regMatch[0];
    let index = parseInt(regMatch[1]);
    let newSuffix = suffix.replace(index, nextIndex);
    let nextLink = currentLink.replace(suffix, newSuffix);
    return nextLink;
}

function formateCupboardLink(link) {
    let linkArray = link.split('-');
    let result = '';
    linkArray.forEach((line, index) => {
        if (index != 2) result += line;
        else result += '1';
        if (index < linkArray.length - 1) result += '-';
    })
    return result;
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
    //str = str.replace(/\./g, '');
    return str;
}

function renameFile(fileName) {
    let str = fileName;
    if (str.endsWith('.')) {
        str += 'jpg';
    }
    return str;
}

function getFileName(fileLink) {
    let linkArray = fileLink.split('/');
    if (linkArray && linkArray.length < 0) {
        linkArray = null;
        return fileLink;
    }
    let fileName = linkArray[linkArray.length - 1];
    fileName = renameFile(fileName);
    return replaceBadFileName(fileName);
}

function buildRoom(link) {
    let result;
    try {
        let address = link;
        let domainLink = link.substring(0, link.lastIndexOf('/') + 1);
        let regEx = /-(\d+)\.html/gi;
        let regMatch = regEx.exec(link);
        let suffix = regMatch[0];
        let index = parseInt(regMatch[1]);
        let newSuffix = suffix.replace(index, index + 1);
        let nextLink = link.replace(suffix, newSuffix);
        let response = request.get(link, {}, 'gb2312');
        let $ = cheerio.load(response);
        let title = /\|(.*?)-/.exec($('title').text())[1].trim();
        let links = $('form table').last().find('a').filter((i, element) => {
                return $(element).attr('href').startsWith('thread-') &&
                    $(element).attr('title') == undefined;
            }).map((i, element) => { return $(element).attr('href') }).get()
            .map(l => domainLink + formateCupboardLink(l));

        result = {
            address: address,
            title: title,
            cupboardLinks: links,
            nextLink: nextLink
        };
    } catch (ex) {
        log.write('build room error', link, response, ex);
    } finally {
        response = null;
        $ = null;
    }
    return result;
}

function getArchives(link, identifier) {
    try {
        if (identifier) {
            let archivesLink = setting.archivesRoom + identifier;
            let response = request.get(archivesLink, {}, 'utf8');
            if (response) {
                let $ = cheerio.load(response);
                let detailLink = $('a .movie-box').eq(0).attr('href');
                if (detailLink) {
                    response = request.get(detailLink, {}, 'gb2312');
                    $ = cheerio.load(response);
                    let files = $('a .sample-box').attr('href');
                    let performer = $('a .avatar-box').first().find('span').text();
                    let infoElement = $('div .col-md-3').find('p');
                    return {
                        date: infoElement.eq(1),
                        publisher: infoElement.eq(4).text(),
                        category: infoElement.eq(8).find('a').text(),
                        stagePhotos: $('a .sample-box').attr('href')
                    };
                }
            }
        }
    } catch (ex) {
        log.write('build archives error', link, null, ex);
    }
    return null;
}

function buildCupboard(link) {
    let result;
    try {
        let address = link;
        let domainLink = link.substring(0, link.lastIndexOf('/') + 1);
        let response = request.get(link, {}, 'gb2312');
        let $ = cheerio.load(response);
        let title = $('div .postcontent').find('h2').text();
        let identifier;
        let identifierMatch = title.match(/[a-zA-Z]{1,}\-\d+/gi);
        if (identifierMatch) identifier = identifierMatch[0];
        let postInfo = $('div .postcontent').find('.postinfo').eq(0).text().replace(/\s{2,}/g, '');
        let date = /\d+-\d+-\d+ \d+:\d+/gi.exec(postInfo)[0];
        date = `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;
        let content = $('div .postcontent');
        let list = [];
        let torrent = content.find('.t_attachlist a').each((i, element) => {
            if ($(element).attr('href').startsWith('attachment.php?aid=')) {
                list.push({
                    name: getFileName($(element).text()),
                    link: domainLink + $(element).attr('href')
                });
            }
        });
        let pics = content.find('.t_msgfont img').each((i, element) => {
            if (!$(element).attr('src').endsWith('.gif')) {
                let fileLink = $(element).attr('src');
                let fileName = getFileName(fileLink);
                list.push({ name: fileName, link: fileLink });
                fileLink = null;
                fileName = null;
            }
        });
        //let archives = getArchives(link, identifier);
        result = {
            identifier: identifier,
            address: address,
            title: title,
            date: date,
            files: list
        }
    } catch (ex) {
        log.write('build cupboard error', link, response, ex);
    } finally {
        response = null;
        $ = null;
    }
    return result;
}

module.exports.buildRoomLink = buildRoomLink;

module.exports.room = function(link) {
    let i = 1;
    let result = buildRoom(link);
    if (!result) {
        while (!result) {
            result = buildRoom(link);
            if (result) break;
            if (i >= setting.build.retryCount) break;
            i++;
        }
    }
    return result;
}

module.exports.cupboard = function(link) {
    let i = 1;
    let result = buildCupboard(link);
    if (!result) {
        while (!result) {
            result = buildCupboard(link);
            if (result) break;
            if (i >= setting.build.retryCount) break;
            i++;
        }
    }
    return result;
}

module.exports.replaceBadFileName = replaceBadFileName;