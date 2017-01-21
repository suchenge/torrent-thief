let dateAdd = function(interval, number, date = new Date()) {
    switch (interval.toLowerCase()) {
        case "y":
            return new Date(date.setFullYear(date.getFullYear() + number));
        case "m":
            return new Date(date.setMonth(date.getMonth() + number));
        case "d":
            return new Date(date.setDate(date.getDate() + number));
        case "w":
            return new Date(date.setDate(date.getDate() + 7 * number));
        case "h":
            return new Date(date.setHours(date.getHours() + number));
        case "n":
            return new Date(date.setMinutes(date.getMinutes() + number));
        case "s":
            return new Date(date.setSeconds(date.getSeconds() + number));
        case "l":
            return new Date(date.setMilliseconds(date.getMilliseconds() + number));
    }
}

let getDate = function(date) {
    if (date == null) return null;
    if (typeof(date) == 'Date') return date;
    return new Date(date);
}

let getCurrentDateTime = function() {
    return formate(Date.now(), 'yyyy-MM-dd hh:mm:ss');
}

let getCurrentDate = function() {
    return formate(Date.now(), 'yyyy-MM-dd');
}

let formate = function(date, fmt = 'yyyy-MM-dd') {
    date = new Date(date);
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports.dateAdd = dateAdd;
module.exports.getDate = getDate;
module.exports.formate = formate;
module.exports.getCurrentDate = getCurrentDate;
module.exports.getCurrentDateTime = getCurrentDateTime;