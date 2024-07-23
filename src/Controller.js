const path = require('path')
const parseDir = require("./app/parserDir");
const fs = require('fs')
const child_process = require('child_process');
const request = require('request');
const cheerio = require('cheerio')
const express = require('express');
const process = require('process');
const controller = new AbortController();
const { signal } = controller;

let targetDir = path.resolve(__dirname);
const adressPage = 'localhost:3001/pages/';
let curPage = '1'
let curPages = []
let RootPATH = __dirname;
let curProcess;
let isHTML = false;
let configPath;
let selectedScripts = [];

fs.readFile(path.resolve(RootPATH, 'config', 'paths.json'), (err, data)=> {
    configPath = JSON.parse(data)[0];
    curPages = configPath.pages
});

exports.root = (req, res)=> {
    
    
    res.render('index', {
        title: 'app',
        curDir: parseDir.parserDir(targetDir),
        curfile: parseDir.parserFile(targetDir),
        file: 'http://' +adressPage + curPage,
        isHTML: isHTML,
        curPages: curPages,
        isServerStart: !isHTML,
        selectedScripts: selectedScripts
    }, (err, html) => {
        if (err) return err
        fs.readFile(path.resolve(RootPATH, 'config', 'paths.json'), (err, data)=> {
            configPath = JSON.parse(data)[0];
            curPages = configPath.pages
        });
        res.send(html)
    })
}

exports.rootDir = express.static('./')


exports.css = (req, res)=> {
    res.sendFile(`${RootPATH}/css/style.css`)
}

// file system
exports.changePath = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let curCommand = JSON.parse(JSON.stringify(req.body));
    targetDir = path.resolve(targetDir, curCommand.but1)
    if (curCommand.but1 == 'node_modules') {
        targetDir = path.resolve(__dirname)
    }    
    res.redirect('/')
}

exports.backPath = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    targetDir = path.normalize(targetDir)
    targetDir = path.resolve(targetDir, '..')
    
    res.redirect('/')
}

exports.rootPath = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    targetDir = RootPATH;
    __dirname = RootPATH;
    res.redirect('/')
}

// exports.openFile = (req, res) => {
//     if(!req.body) return res.sendStatus(400);
//     let curCommand = JSON.parse(JSON.stringify(req.body));
//     let pathToFile = path.resolve(targetDir, curCommand.but1)
//     let pathToFileStart = path.resolve(targetDir, 'server.js')
//     isHTML = false
//     let format = curCommand.but1.split('.').at(-1),
//         command = "const express = require('express');const process = require('process');const app = express();app.use('/', express.static('./'));app.listen(3001, ()=>console.log(process.pid));"
    
//     fs.readFile(pathToFile, (err, data)=> {
//         targetfile = data.toString()
//     })

//     if (curProcess != undefined) {
        
//         process.kill(curProcess)
//         curProcess = undefined
//     }
//     console.log(curProcess)
//     if (format == 'html') {
        
//         isHTML = true
//         fs.writeFile(pathToFileStart, data=command, (err) => {
//             if(err) {
//                 return;
//             }
//             child_process.exec(`node ${pathToFileStart}`, {
//                 cwd: targetDir, 
//                 signal: signal,
//                 timeout: 1000
//             }, (err, stdout, stderr) => {
//                 curProcess = stdout;
//             })

            
//         })
//     }
    
//     res.redirect('/')
// }

exports.setPath = (req, res) => {
    
    let server = "const express = require('express');const process = require('process');const app = express();app.use('/', express.static('./'));app.listen(3001, ()=>console.log(process.pid));"
    let pakage = {
        "name": "1",
        "version": "1.0.0",
        "description": "",
        "main": "App.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1",
          "start": "node ./server.js"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
          "express": "^4.19.2"
        }
      }
    fs.readFile(path.resolve(RootPATH, 'config', 'paths.json'), (err, data)=> {
        configPath = JSON.parse(data)[0];

        
        
        configPath.targetServerPath = path.resolve(targetDir, 'opt')
        configPath.pages = parseDir.parserDir(path.resolve(configPath.targetServerPath, 'pages'));

        if (fs.existsSync(path.resolve(configPath.targetServerPath, 'server.js')) && 
            fs.existsSync(path.resolve(configPath.targetServerPath, 'package.json'))) {
                fs.writeFile(path.resolve(RootPATH, 'config', 'paths.json'), data=JSON.stringify([configPath]), (err)=> {
                    if (err) return err
                })    
                return;
        }

        fs.mkdir(path.resolve(targetDir, 'opt'), () => {
            fs.mkdir(path.resolve(targetDir, 'opt', 'pages'), () => {
            })

            fs.writeFile(path.resolve(configPath.targetServerPath, 'server.js'), data=server, (err) => {
                if(err) {
                    return;
                }
                fs.writeFile(path.resolve(configPath.targetServerPath, 'package.json'), data=JSON.stringify(pakage), (err) => {
                    if(err) {
                        return;
                    }
                    fs.writeFile(path.resolve(RootPATH, 'config', 'paths.json'), data=JSON.stringify([configPath]), (err)=> {
                        if (err) return err
                    })
                })
            })
        })
        
    })
    res.redirect('/')
}

exports.downloadDep = (req, res) => {

    fs.exists(configPath.targetServerPath, (e)=> {
        if (e) {
            if (fs.existsSync(path.resolve(configPath.targetServerPath, 'node_modules'))) {
                console.log('even')
                return;
            }

            if (fs.existsSync(path.resolve(configPath.targetServerPath, 'server.js')) && 
                fs.existsSync(path.resolve(configPath.targetServerPath, 'package.json'))) {
                    child_process.exec(`npm i`, {
                        cwd: configPath.targetServerPath, 
                        signal: signal,
                        timeout: 1000
                    }, (err, stdout, stderr) => {
                        curProcess = stdout;
                    })
            }
        }
    })

    

        
    res.redirect('/')
}

exports.startServer = (req, res) => {
    isHTML = true;
    if (fs.existsSync(path.resolve(configPath.targetServerPath, 'node_modules')) &&
        fs.existsSync(path.resolve(configPath.targetServerPath, 'server.js')) && 
        fs.existsSync(path.resolve(configPath.targetServerPath, 'package.json'))) {
            child_process.exec(`node server.js`, {
                cwd: configPath.targetServerPath, 
                signal: signal,
                timeout: 1000
            }, (err, stdout, stderr) => {
                curProcess = stdout;
            })
            
    } 
    res.redirect('/')
}

exports.stopServer = (req, res) => {
   
    if (curProcess != undefined) {
        process.kill(curProcess);
        curProcess = undefined;
        isHTML = false;
    };
    res.redirect('/')
}

exports.selectPage = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let curCommand = JSON.parse(JSON.stringify(req.body));
    curPage = String(curCommand.but1)
    res.redirect('/')
}

exports.selectScripts = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let curCommand = JSON.parse(JSON.stringify(req.body));

    console.log(curCommand)

    fs.readFile(path.resolve(configPath.targetServerPath, 'pages', curPage, 'index.html'), 'utf8', (err, data) => {
        data.replace(
            /<script\s+src="[^"]*jquery[^"]*"><\/script>/g, 
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.js"></script><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/intlTelInput.min.js"></script>'
        )
        selectedScripts = data.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g);
        //console.log(selectedScripts)
    })
    res.redirect('/')
}

exports.scriptEdit = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let curCommand = JSON.parse(JSON.stringify(req.body));

    if (curCommand.remove_script) {
        fs.readFile(path.resolve(configPath.targetServerPath, 'pages', curPage, 'index.html'), 'utf8', (err, data) => {
            let editeddata = String(data)

            editeddata.replace(String(curCommand.remove_script), ' ')

            console.log( editeddata.match(curCommand.remove_script))

            fs.writeFile(path.resolve(configPath.targetServerPath, 'pages', curPage, 'index.html'), data=String(editeddata)  ,(err, data) => {
                if (err) return err
            })
        })

    }

    console.log(curCommand)

    res.redirect('/')
}