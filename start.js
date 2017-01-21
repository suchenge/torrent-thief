const commander = require('commander');
const Thielf = require('./modules/thief');

commander.command('pilfer <linkNumber> <endDate> <linkCount>')
    .action(function(linkNumber, endDate, linkCount) {
        let number = linkNumber ? linkNumber : 230;
        let toDate = endDate ? endDate : null;
        let count = linkCount ? linkCount : 1;

        new Thielf().pilfer(number, toDate, count);
        console.log('done');
    });

commander.parse(process.argv);