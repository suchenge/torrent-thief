const colors = require('colors');
const dateHelper = require('./utility/date');
const Box = require('./box');
const Builder = require('./builder');
const BlackDomain = require('./blackDomain');
const setting = require('./setting');

let blackDomain = new BlackDomain();

function print(message) {
    console.log(message);
}

function roomLinkNumber(currentLink) {
    let regEx = /-(\d+)\.html/gi;
    let regMatch = regEx.exec(currentLink);
    let suffix = regMatch[0];
    let index = parseInt(regMatch[1]);
    return index;
}

function pilferRoom(roomLink, roomName, roomBox, treasure, endDate, next = '') {
    let room = Builder.room(roomLink);
    if (room) {
        treasure.menu.append({
            date: dateHelper.getCurrentDateTime(),
            link: roomLink,
            number: roomLinkNumber(roomLink),
            category: roomName
        });
        if (room.cupboardLinks && room.cupboardLinks.length > 0) {
            print(`pilfer ${next}:${roomLink}`.yellow);
            let cupboardLink, cupboard, cupboardBox, cupboardIndex, dateBox, backUrl;
            let i = 0;
            let count = room.cupboardLinks.length;
            while (count > 0) {
                if (i == count) pilferRoom(room.nextLink, roomName, roomBox, treasure, endDate, 'next');
                cupboardLink = room.cupboardLinks[i];
                if (cupboardLink) {
                    print(`${count}:${i + 1} `);
                    cupboard = Builder.cupboard(cupboardLink);
                    if (cupboard) {
                        print(`cupboard date:${cupboard.date}`.yellow);
                        if (Date.parse(endDate) < Date.parse(cupboard.date)) {
                            if (cupboard.files != null && cupboard.files.length > 0) {
                                dateBox = roomBox.getChild(dateHelper.formate(cupboard.date));
                                cupboardBox = dateBox.getChild(cupboard.title);
                                cupboardIndex = {
                                    date: cupboard.date,
                                    link: cupboardLink,
                                    title: cupboard.title,
                                    box: cupboardBox.name
                                };
                                if (!dateBox.menu.contain(cupboardIndex)) {
                                    for (let file of cupboard.files) {
                                        if (!blackDomain.contain(file.link)) {
                                            if (!cupboardBox.saveFile(file.name, file.link)) {
                                                blackDomain.append(file.link);
                                            }
                                        }
                                    }
                                    dateBox.menu.append(cupboardIndex);
                                    Object.assign(cupboardIndex, { files: cupboard.files });
                                    cupboardBox.menu.append(cupboardIndex);
                                    print(`successful.`);
                                } else print(`contained`.red);
                            } else print(`cupboard[${cupboardLink}] files is null`.red);
                        } else {
                            print(`${endDate} < ${cupboard.date}`.yellow);
                            break;
                        }
                    } else print(`cupboard[${cupboardLink}] is null`.red);
                }
                cupboardIndex = null;
                dateBox = null;
                cupboardBox = null;
                cupboardLink = null;
                cupboard = null;
                i++;
            }
        } else print(`room[${roomLink}] cupboard links is null`.red)
    } else print(`room[${roomLink}] is null`.red);
}

class Thief {
    constructor() {
        this.treasure = new Box(setting.path.treasure);
    }
    pilfer(roomNumber, endDate = null, roomCount = 0) {
        let roomInfo = setting.rooms.filter(room => (room.number == roomNumber))[0];
        let roomBox = this.treasure.getChild(roomInfo.title);
        let roomLink = roomInfo.link;

        if (roomCount == -1) {
            let roomLinks = this.treasure.menu.list.filter(index => (index.category == roomInfo.title))
                .sort((left, right) => (left.number < right.number ? 1 : (left.number > right.number ? -1 : 0)));
            let roomLink = roomLinks[0].link;
            roomLinks = null;
        } else if (roomCount > 0) roomLink = Builder.buildRoomLink(roomLink, roomCount);


        if (!endDate) {
            let roomLastDateBox = roomBox.list[0];
            endDate = roomLastDateBox.name;
        }
        pilferRoom(roomLink, roomInfo.title, roomBox, this.treasure, endDate);

        roomInfo = null;
        roomBox = null;
    }
}

module.exports = Thief;