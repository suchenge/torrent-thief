const path = require('path').resolve('');

module.exports = {
    path: {
        treasure: `${path}\\treasures`,
        blackDomain: `${path}\\config\\blackDomain.config`,
        keyword:`${path}\\config\\keyword.config`,
        log: `${path}\\log`
    },
    whiteDomain: ['67.220.91.30'],
    request: {
        retryCount: 3,
        retryDelay: 1000,
        timeout: 2000
    },
    build: {
        retryCount: 3
    },
    menu: {
        name: 'index.json',
        splitSymbol: `,\r\n`
    },
    archivesRoom: 'https://www.av28.com/en/search/',
    rooms: [{
            number: 230,
            title: '亚洲有码原创区',
            link: 'http://67.220.91.30/forum/forum-230-1.html'
        },
        {
            number: 58,
            title: '亚洲有码转帖区',
            link: 'http://67.220.91.30/forum/forum-58-1.html'
        },
        {
            number: 143,
            title: '亚洲无码原创区',
            link: 'http://67.220.91.30/forum/forum-143-1.html'
        }
    ]
};