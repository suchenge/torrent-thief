const fs = require('fs');

class Dictionary{
    constructor(){
        this.path = "D:\\dictionary\\";
        this.indexsPath = this.path + "indexs\\";
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
                if (!paths.some(path => path == filePath)){
                    index.paths.push(filePath);
                }
            }else{
                index = {
                    paths:[filePath]
                };
            }
            let indexContent = JSON.stringify(index, null, 4);
            fs.writeFileSync(indexPath, indexContent);
        }
    }
    appends(path){
        fs.readdir(path, (err, file) => {
            this.append(file, path + "\\" + file);
        });
    }
}

module.exports = Dictionary;