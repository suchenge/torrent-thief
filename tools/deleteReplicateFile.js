const fs = require("fs");
const path = "G:\\Torrent\\Picture";
fs.readdir(path,(err, files) => {
    files.forEach(file => {
        if (/.*-\d+ \(\d+\).jpg/.test(file)){
            let filepath = path + "\\" + file;
            fs.unlinkSync(filepath);
            console.log(filepath);
        }
    });
});
