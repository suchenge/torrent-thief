const fs = require("fs");
const cheerio = require("cheerio");
const request = require("./utility/syncRequest");
const Dictionary = require("./dictionary");


const dict = new Dictionary();

class Disposal{
    constructor(path){
        this.path = path;
    }
    run(doneCallBack){
        fs.readdir(this.path, (err, files) => {
            files.forEach(file => {
                let currentPath = this.path + "\\" + file;
                
                fs.stat(currentPath, (err, stats) => {
                    console.log(currentPath);
                    try{
                        if (stats.isFile()){
                            let regex = /(.*?)\.([A-Za-z0-9]{3})/.exec(file);
                            let fileName = regex[1].toUpperCase();
                            let fileType = regex[2];
                            let filePath = fileName + "." + fileType;
                            let info = getMoveInfo(fileName);
                            if (info && info.title && info.img){
                                let newFolder = this.path + "\\" + info.title;
                                let newFilePath = newFolder + "\\" + filePath;
                                if (!fs.existsSync(newFolder)){
                                    fs.mkdirSync(newFolder);
                                    let imgContent = request.getFile(info.img);
                                    fs.writeFileSync(`${newFolder}\\${fileName}.jpg`, imgContent);
                                    fs.renameSync(currentPath, newFilePath);
                                }else{
                                    if (!fs.existsSync(newFilePath)){
                                        fs.renameSync(currentPath, newFilePath);
                                    }
                                }
                                dict.append(info.title, newFilePath);
                            }else dict.append(file, currentPath);
                        }else{
                            let regex = /^([A-Za-z]{0,}\-\d+)$/;
                            if (regex.test(file)){
                                let fileName = regex.exec(file)[1];
                                let info = getMoveInfo(fileName);
                                if (info && info.title && info.img){
                                    let imgpath = `${currentPath}\\${fileName}.jpg`;
                                    let imgContent = request.getFile(info.img);
                                    fs.writeFileSync(imgpath, imgContent);
        
                                    let newFolderPath = path + "\\" + info.title;
                                    if (!fs.existsSync(newFolderPath)){
                                        fs.renameSync(currentPath, newFolderPath);
                                        dict.append(info.title, newFilePath);
                                    }
                                } else {
                                    dict.append(file, currentPath);
                                }
                            }else {
                                dict.append(file, currentPath);
                            }
                        }
                    }catch(ex){
                        console.log(ex);
                    }
                });
            });
            doneCallBack();
        });
    }
}


function getMoveInfo(fileName){
    try{
        let response = request.get("https://www.javhoo.co/ja/av/"+ fileName);
        let $ = cheerio.load(response);
        let title = $("h1").text();
        let imgUrl = $("img.size-full").attr("src");
        let result = {title:title,img:imgUrl};
        console.log(result);
        return result;
    }catch(ex){
        console.log(ex);
        return null;
    }
}

module.exports = Disposal;