const fs = require("fs");
const colors = require('colors');
const cheerio = require("cheerio");
const request = require("./utility/syncRequest");
const Dictionary = require("./dictionary");
const build = require("./builder");
//const webDriver = require("selenium-webdriver");


const dict = new Dictionary();
let directoryPath = "";
let errFileList = [];
let disposaledCount = 0;

class Disposal{
    constructor(path){
        directoryPath = path;
    }
    
    run(){
        /*let tempArr = ["h","4","r","0","c"];
        let arrIndex = tempArr.findIndex(value => { return value == "0"; });
        tempArr.splice(arrIndex,1);*/

        let filePaths = fs.readdirSync(directoryPath);
        disposalPath(filePaths, getMoveInfoFunction1);

        if(errFileList.length > 0) disposalPath(errFileList, getMoveInfoFunction3);

        console.log("done");
    }
}

var getMoveInfoFunction1 = {
    get:getMoveInfo1,
    push:function(fileName){
        errFileList.push(fileName);
    }
};

var getMoveInfoFunction3 = {
    get:getMoveInfo3,
    push:function(fileName){
        let index = errFileList.findIndex(value => { return value == fileName; });
        errFileList.splice(index, 1);
    }
};

function disposalPath(files, getMoveInfoFunction){
    let count = files.length;

    for(let index = 0; index < count; index++){

        let file = files[index];
        let currentPath = directoryPath + "\\" + file;
        let isFile = fs.statSync(currentPath).isFile();

        if (isFile) disposalFile(file, currentPath, getMoveInfoFunction);
        else disposalDirectory(file, currentPath, getMoveInfoFunction);

        if (disposaledCount > 0){
            console.log("[" + disposaledCount.white + "/" + count + "]");
        }
    }
}

function disposalFile(file, currentPath, getMoveInfoFunction){
    let regex = /(.*?)\.([A-Za-z0-9]{3})/.exec(file);
    let fileName = regex[1].toUpperCase();
    let fileType = regex[2];
    let filePath = fileName + "." + fileType;
    let info = getMoveInfo(filePath, getMoveInfoFunction);
    if (info && info.title && info.img){

        disposaledCount ++;

        let newFolder = directoryPath + "\\" + info.title;
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
}

function disposalDirectory(file, currentPath, getMoveInfoFunction){
    let regex = /^([0-9a-zA-Z]{0,})$/;
    //if (regex.test(file)){
        //let fileName = regex.exec(file)[1];
        let fileName = file;
        let info = getMoveInfo(fileName, getMoveInfoFunction);
        if (info && info.title && info.img){

            disposaledCount ++;
            let imgPath = `${currentPath}\\${fileName}.jpg`;
            let imgContent = request.getFile(info.img);
            fs.writeFileSync(imgPath, imgContent);

            let newFolderPath = directoryPath + "\\" + info.title;
            if (!fs.existsSync(newFolderPath)){
                fs.renameSync(currentPath, newFolderPath);
                dict.append(info.title, newFolderPath);
            }
        } else dict.append(file, currentPath);
    //}else dict.append(file, currentPath);
}

function getMoveInfo(filePath, getMoveInfoFunction){
    let fileName = filePath.split(".")[0];

    try{
        let result = getMoveInfoFunction.get(fileName);
        if (result && result.title && result.img) return result;
    }catch(ex){
        getMoveInfoFunction.push(filePath);
    }
}

function getMoveInfo1(fileName){
    console.log("get move info 1");
    try{
        let url = "https://www.javhoo.org/ja/av/"+ fileName;
        console.log(url);
        let response = request.get(url);
        let $ = cheerio.load(response);
        let title = $("h1").text();
        let imgUrl = $("img.size-full").attr("src");
        let result = {title: build.replaceBadFileName(title), img: imgUrl};
        console.log(result);
        return result;
    }catch(ex){
        console.log(ex);
        return result;
    }
}

function getMoveInfo3(fileName){
    console.log("get move info 3");
    try{
        let url = "https://www.mgstage.com/product/product_detail/" + fileName +"/";
        console.log(url);
        let response = request.get(url);
        let $ = cheerio.load(response);
        let title = $("h1").text();
        let imgUrl = $("#EnlargeImage").attr("href");
        let result = {title: fileName + "" + build.replaceBadFileName(title), img: imgUrl};
        console.log(result);
        return result;
    }catch(ex){
        console.log(ex);
        return result;
    }
}

function getMoveInfo2(fileName){
    console.log("get move info 2");
    try{
        let url = "https://japan.silviaol.com/code/"+ fileName;
        console.log(url);
        let response = request.get(url);
        let $ = cheerio.load(response);
        let title = $("div.head_coverbanner").find("h2").eq(1).find("strong").text();
        let imgUrl = $("div.head_coverbanner_image img").attr("src");
        let result = {title: build.replaceBadFileName(fileName + " " + title), img: imgUrl};
        console.log(result);
        return result;
    }catch(ex){
        console.log(ex);
        return null;
    }
}

module.exports = Disposal;