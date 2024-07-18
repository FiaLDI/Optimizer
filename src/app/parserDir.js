const fs = require('fs');
const path = require('path')

let dirList = []

function parseDir(dir) {
    try {
        dirList = []
        const files = fs.readdirSync(path.resolve(dir), { withFileTypes: true });
        files.forEach(file => {
            if (file.isDirectory() ) {
                dirList.push(file.name);
            }   
        });
        
        return dirList
    } catch (err) {
        console.error('Error reading directory:', err);
    }
    
    return [];
}


function parseFile(dir) {
    try {
        fileList = []
        const files = fs.readdirSync(path.resolve(dir), { withFileTypes: true });
        files.forEach(file => {
            if (file.isFile() ) {
                fileList.push(file.name);
            }   
        });
        
        return fileList
    } catch (err) {
        console.error('Error reading directory:', err);
    }
    
    return [];
}

module.exports = {
    parserDir:parseDir,
    parserFile: parseFile,
};