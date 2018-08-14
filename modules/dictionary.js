const fs = require('fs');

class Dictionary{
    constructor(doneCallback){
        this.path = "D:\\dictionary\\";
        this.indexsPath = this.path + "indexs\\";
        this.replicateIndexPath = this.path + "replicate.txt";
        this.doneCallback = doneCallback;
    }
    resolve(fileName){
        let patten = /([A-Za-z]{0,}\-\d+)/;
        if (patten.test(fileName)){
            return patten.exec(fileName)[1];
        }else return null;
    }    
    append(fileName, filePath){
        let file = this.resolve(fileName);

        if(file){
            let index = {};
            let indexPath = this.indexsPath + file.trim() + ".json";
            if (fs.existsSync(indexPath)){
                let indexContent = fs.readFileSync(indexPath);
                index = JSON.parse(indexContent);
                let paths = Array.from(index.paths);
                let newPath = [];
                
                if (paths.length > 0){
                    paths.forEach(path => {
                        if (path != filePath){
                            newPath.push(path);
                        }
                    });
                }
                newPath.push(filePath);
                index.paths = newPath;
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

    indexAppend(dirPath, callBack = false){
        fs.readdir(dirPath, (err, files) => {
            let count = files.length;
            files.forEach((file, index) => {
                this.append(file, dirPath + "\\" + file);
                if (index == count - 1 && callBack) this.doneCallback();
            });
        });
    }

    appends(path, next = 0){
        if (next == 0) this.indexAppend(path, true);
        else {
            let dirs = fs.readdirSync(path);
            let count = dirs.length;

           dirs.forEach((dir, index) => {
               if (dir != "$RECYCLE.BIN" && dir != "System Volume Information" && dir != "Thumbs.db"){
                   this.indexAppend(path + "\\" + dir);
               }
               if (index == count - 1) this.doneCallback();
           });
        }
    }
}

module.exports = Dictionary;