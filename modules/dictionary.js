const fs = require('fs');

class Dictionary{
    constructor(doneCallback){
        this.path = "D:\\dictionary\\";
        this.indexsPath = this.path + "indexs\\";
        this.replicateIndexPath = this.path + "replicate.json";
        this.doneCallback = doneCallback;

        if (!fs.existsSync(this.replicateIndexPath)) fs.createWriteStream(this.replicateIndexPath);
    }
    resolve(fileName){
        let patten = /([A-Za-z]{0,}\-\d+)/;
        if (patten.test(fileName)){
            return patten.exec(fileName)[1];
        }else return null;
    }    
    append(fileName, filePath, driveLetter = null){
        let file = this.resolve(fileName);

        if(file){
            if (driveLetter){
                filePath = filePath.replace(/[A-Z]\:/, driveLetter);
            }

            let index = {};
            let indexPath = this.indexsPath + file.trim() + ".json";

            if (fs.existsSync(indexPath)){
                let indexContent = fs.readFileSync(indexPath);
                index = JSON.parse(indexContent);
                index.paths = Array.from(index.paths);
                if (index.paths.evey(path => path != filePath)){
                    index.paths.push(filePath);
                }
            }else{
                index = {
                    sn:file,
                    paths:[filePath]
                };
            }
            
            let indexContent = JSON.stringify(index, null, 4);
            if (index.paths.length > 1) {
                console.log(indexContent);
                fs.appendFileSync(this.replicateIndexPath, indexContent);
            }
            fs.writeFileSync(indexPath, indexContent);
        }
    }

    indexAppend(dirPath, driveLetter = null, callBack = false){
        fs.readdir(dirPath, (err, files) => {
            let count = files.length;
            files.forEach((file, index) => {
                this.append(file, dirPath + "\\" + file, driveLetter);
                if (index == count - 1 && callBack) this.doneCallback();
            });
        });
    }

    appends(path, driveLetter = null, next = 0){
        if (next == 0) this.indexAppend(path, driveLetter, true);
        else {
            let dirs = fs.readdirSync(path);
            let count = dirs.length;

           dirs.forEach((dir, index) => {
               if (dir != "$RECYCLE.BIN" && dir != "System Volume Information" && dir != "Thumbs.db"){
                   this.indexAppend(path + "\\" + dir, driveLetter);
               }
               if (index == count - 1) this.doneCallback();
           });
        }
    }
}

module.exports = Dictionary;