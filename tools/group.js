const fs = require("fs");
const path = "N:\\写真\\1";
const suffixs = ["mkv","mp4","avi","wmv"];

let files = fs.readdirSync(path);
let moveFiles = files.filter(file => suffixs.some(s => file.endsWith(s)));
moveFiles.forEach((file, index) => {
    let filePath = path + "\\" + file;
    let status = fs.statSync(filePath);
        if (status.isFile && fs.existsSync(filePath)){
                let fileName = /([A-Za-z]{0,}\-\d+)/.exec(file)[1];
                let pic = files.find(f => f.endsWith("jpg") && f.startsWith(fileName));
                if (pic){
                    let folder = path + "\\" + pic.replace(".jpg", "");
                    let newPicPath = folder + "\\" + fileName + ".jpg";
                    let newFilePath = folder + "\\" + file;

                    fs.mkdirSync(folder);
                    fs.renameSync(path + "\\" + pic, newPicPath);
                    fs.renameSync(path + "\\" + file, newFilePath);
                }
        }
});