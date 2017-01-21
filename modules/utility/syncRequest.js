const syncRequest = require('sync-request');
const encoding = require('iconv-lite');
const log = require('./log');
const setting = require('../setting');

function decode(content, encode) {
    let format = 'utf8';
    if (encode != null) format = encode;
    let result = encoding.decode(content, format);
    return result;
}

function request(url) {
    try {
        let res = syncRequest('GET', url, {
            timeout: setting.request.timeout,
            retry: setting.request.retryCount > 0,
            retryDelay: setting.request.retryDelay,
            maxRetries: setting.request.retryCount
        });
        if (res.statusCode == 200) {
            let body = res.body;
            res = null;
            return { body: body, err: null };
        }
    } catch (ex) {
        log.write('request error', url, null, ex);
        return { body: null, err: ex };
    }
}

exports.get = function(url, headers = {}, encode = null) {
    //let i = 1;
    let result = request(url);
    /*if (!result || !result.body) {
        while (!result || !result.body) {
            if (i >= setting.requestRetryCount) break;
            result = request(url);
            if (result && result.body) break;
            i++;
        }
    }*/
    if (!result || !result.body) return null;
    else return decode(result.body, encode);
}

exports.getFile = function(url) {
    //let i = 1;
    let result = request(url);
    /*if (!result || !result.body) {
        while (!result || !result.body) {
            if (i >= setting.requestRetryCount) break;
            result = request(url);
            if (!result || !result.body) break;
            i++;
        }
    }*/
    if (!result || !result.body) return null;
    else return result.body;
}