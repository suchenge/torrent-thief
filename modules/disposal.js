const fs = require("fs");
const colors = require('colors');
const cheerio = require("cheerio");
const request = require("./utility/syncRequest");
const Dictionary = require("./dictionary");
const build = require("./builder");
const dateHelper = require('./utility/date');
const browser = require("./browser");

const dict = new Dictionary();

let filePaths = [];
let errFilePaths = [];

let directoryPath = "";
let disposaledCount = 0;

let driver = null;
let browserDriver = null;

class Disposal{
    constructor(path){
        directoryPath = path;
    }
    
    async run(){
        filePaths = fs.readdirSync(directoryPath);
        let getMovieInfoFunctions = [
                                        //getMovieInfoFunction1,
                                        //getMovieInfoFunction2,
                                        //getMovieInfoFunction3,
                                        getMovieInfoFunction4
                                    ];

        for(let i = 0; i < getMovieInfoFunctions.length; i++){
            if (filePaths.length === 0) break;

            let getMovieInfoFunction = getMovieInfoFunctions[i];

            await getMovieInfoFunction.begin();
            await disposalPath(filePaths, getMovieInfoFunction);
            await getMovieInfoFunction.end();

            filePaths = [];
            errFilePaths.forEach((file => filePaths.push(file)));
            errFilePaths = [];
        }

        console.log("done");
    }
}

var getMovieInfoFunction1 = {
    begin: () => {
    },
    get: getMovieInfo1,
    end: () => {
    }
}

var getMovieInfoFunction2 = {
    begin: async () => {
        if (browserDriver == null || driver == null){
            browserDriver = new browser();
            driver = browserDriver.getDriver();

            await driver.get("https://www.mgstage.com/");
            let pageTitle = await driver.getTitle();

            if (pageTitle === "MGS動画(成人認証) - アダルト動画サイト MGS動画") {
                await driver.findElement(browserDriver.byXPath("//a[@id='AC']")).click();
            }
        }
    },
    get: getMovieInfo2,
    end: async () => {
        driver.quit();
        driver = null;
        browserDriver = null;
    }
}

var getMovieInfoFunction3 = {
    begin: async () => {
        if (browserDriver == null || driver == null){
            browserDriver = new browser();
            driver = browserDriver.getDriver();

            await driver.get("http://maddawgjav.net/");
            let pageTitle = await driver.getTitle();
            if (pageTitle === "just a moment") dateHelper.sleep(10000);
        }
    },
    get: getMovieInfo3,
    end: async () => {
        driver.quit();
        driver = null;
        browserDriver = null;
    }
}

var getMovieInfoFunction4 = {
    begin: async () => {
        if (browserDriver == null || driver == null){
            browserDriver = new browser();
            driver = browserDriver.getDriver();

            await driver.get("https://javdb.com/");
        }
    },
    get: getMovieInfo4,
    end: async () => {
        driver.quit();
        driver = null;
        browserDriver = null;
    }
}

var getMovieInfoResolve = fileName => {
    let index = filePaths.findIndex(value => { return value.substring(0, value.lastIndexOf(".")) === fileName; });
    filePaths.splice(index, 1);
}

var getMovieInfoReject = fileName => {
    let index = filePaths.findIndex(value => { return value.substring(0, value.lastIndexOf(".")) === fileName; });
    errFilePaths.push(filePaths[index]);
}

async function disposalPath(files, getMoveInfoFunction){
    let count = files.length;

    for(let index = 0; index < count; index++){

        let file = files[index];
        if(file && !["$RECYCLE.BIN","System Volume Information"].includes(file)){
            let currentPath = directoryPath + "\\" + file;
            let isFile = fs.statSync(currentPath).isFile();

            if (isFile) await disposalFile(file, currentPath, getMoveInfoFunction);
            else await disposalDirectory(file, currentPath, getMoveInfoFunction);

            if (disposaledCount > 0){
                console.log("[" + disposaledCount + "/" + count + "]");
            }
        }
    }
}

async function disposalFile(file, currentPath, getMoveInfoFunction){
    let regex = /(.*?)\.([A-Za-z0-9]{3})/.exec(file);
    let fileName = regex[1].toUpperCase();
    let fileType = regex[2];
    let filePath = fileName + "." + fileType;
    let info = await getMovieInfo(filePath, getMoveInfoFunction);
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

async function disposalDirectory(file, currentPath, getMoveInfoFunction){
    let regex = /^([0-9a-zA-Z]{0,})$/;
    //if (regex.test(file)){
        //let fileName = regex.exec(file)[1];
        let fileName = file;
        let info = await getMovieInfo(fileName, getMoveInfoFunction);
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

async function getMovieInfo(filePath, getMoveInfoFunction){
    let fileName = filePath.split(".")[0];

    try{
        let result = await getMoveInfoFunction.get(fileName);
        if (result && result.title && result.img) {
            //getMovieInfoResolve(fileName);
            return result;
        }
        else getMovieInfoReject(fileName);
    }catch(ex){
        getMovieInfoReject(fileName);
    }
}


function getMovieInfo1(fileName){
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

async function getMovieInfo2(fileName) {
    console.log("get move info 2");
    let imgUrl, title;
    let url = "https://www.mgstage.com/product/product_detail/" + fileName + "/";
    console.log(url);

    await driver.get(url);
    imgUrl = await driver.findElement(browserDriver.byXPath("//a[@id='EnlargeImage']")).getAttribute("href");
    title = await driver.findElement(browserDriver.byXPath("//h1[@class='tag']")).getText();

    let result = {title: fileName.toUpperCase() + "" + build.replaceBadFileName(title), img: imgUrl};
    console.log(result);

    return result;
}

async function getMovieInfo3(fileName){
    console.log("get move info 3");
    let url = "http://maddawgjav.net/?s=" + fileName;
    console.log(url);

    await driver.get(url);

    let pageTitle = await driver.getTitle();
    if (pageTitle === "just a moment") dateHelper.sleep(10000);

    let movieTitle = await driver.findElement(browserDriver.byXPath("//h2[@class='title']"));
    if (movieTitle){
        let moviePic = await driver.findElement(browserDriver.byXPath("//p[@style=\"text-align: center;\"]/img"));
        let title = await moviePic.getAttribute("title");
        let imgUrl = await moviePic.getAttribute("src");

        title = title.replace("[FHD]","")
                     .replace("[fhd]","")
                     .replace(fileName,"")
                     .replace(fileName.toLowerCase(),"")
                     .replace(fileName.toUpperCase(),"");

        let result = {title: fileName.toUpperCase() + "" + build.replaceBadFileName(title).toUpperCase(), img: imgUrl};

        return result;
    }
}

async function getMovieInfo4(fileName){
    console.log("get move info 4");
    let url = "https://javdb.com/search?q=" + fileName + "&f=all";
    console.log(url);

    await driver.get(url);

    let listLink = await driver.findElements(browserDriver.byXPath("//div[@class='grid-item column']/a"));
    let listTitleDiv = await driver.findElements(browserDriver.byXPath("//div[@class='grid-item column']/a/div[@class='uid']"));

    for (let i = 0; i < listTitleDiv.length; i ++){
        let listTitle = await listTitleDiv[i].getText();

        if(
            listTitle === fileName
            || listTitle.indexOf(fileName) > -1
            || fileName.indexOf(listTitle) > -1
        ){
            let link = listLink[i];
            await link.click();

            let title = await driver.findElement(browserDriver.byXPath("//h2[@class='title is-4']/strong")).getText();
            let imgUrl = await driver.findElement(browserDriver.byXPath("//img[@class='video-cover']")).getAttribute("src");

            if (title && imgUrl){
                title = title.replace(fileName,"")
                             .replace(fileName.toLowerCase(),"")
                             .replace(fileName.toUpperCase(),"");

                let result = {title: fileName.toUpperCase() + "" + build.replaceBadFileName(title).toUpperCase(), img: imgUrl};

                return result;
            }
        }
    }
}

module.exports = Disposal;