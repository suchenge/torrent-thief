 const http = require('http');
 const url = require('url');
 const path = require('path');
 const fs = require('fs');
 const urlencode = require('urlencode2');
 const Box = require('./modules/treasure/box');

 const defaultAddress = path.resolve('') + '\\treasures';

 function buildText(filePath, fileName) {
     return `<a href='${filePath}'>${fileName}</a>`;
 }

 function buildImage(filePath, fileName) {
     let data = fs.readFileSync(filePath, 'base64');
     return `<img src='data:image/jpg;base64,${data}'>${fileName}</img>`;
 }

 function writeText(res, currentUrl, backUrl, box) {
     res.writeHead(200, { 'content-type': 'text/plain' });
     res.end(fs.readFileSync(box.address));
 }

 function pageTitle(currentUrl) {
     if (currentUrl != '') {
         let urlPaths = currentUrl.split('/');
         return '&nbsp;&nbsp;<span>' + urlencode.decode(urlPaths[urlPaths.length - 2]) + '</span>';
     }
     return '';
 }

 function writeHtml(res, currentUrl, backUrl, boxs) {
     res.writeHead(200, { 'content-type': 'text/html' });
     let html = '<html>';
     if (backUrl != null) {
         html += `<a href='${backUrl}'>`
         html += '[back]';
         html += '</a>';
     }
     html += pageTitle(currentUrl);
     html += '<table>';
     boxs.forEach(box => {
         html += '<tr>';
         html += '<td>';
         if (box.isDir) {
             html += `<a href='${currentUrl}${box.name}'>`;
             html += box.name;
             html += '</a>';
         } else {
             if (box.name.includes('.jpg')) html += buildImage(box.address, box.name);
             else html += buildText(`${currentUrl}${box.name}`, box.name);
         }
         html += '</td>';
         html += '</tr>';
     })
     html += '</table>';
     html += '<html>';
     res.end(html);
 }
 http.createServer((req, res) => {
     req.setEncoding('utf8');
     let box, pathUrl, backUrl = null,
         pathname = url.parse(req.url).pathname;
     if (pathname == '/favicon.ico') return;
     if (pathname == '' || pathname == '/') {
         pathUrl = '';
         box = new Box(defaultAddress);
     } else {
         pathUrl = pathname + '/';
         backUrl = pathname.substring(0, pathname.lastIndexOf('/') + 1);
         box = new Box(defaultAddress + urlencode.decode(pathname.replace('/', '\\'), 'utf8'));
     }
     if (pathname.includes('.txt')) writeText(res, pathUrl, backUrl, box);
     else writeHtml(res, pathUrl, backUrl, box.list);
 }).listen(1127);