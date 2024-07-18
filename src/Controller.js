const path = require('path')
const parseDir = require("./app/parserDir");
const fs = require('fs')
const child_process = require('child_process');
const express = require('express');
const process = require('process');
const controller = new AbortController();
const { signal } = controller;


let targetDir = path.resolve(__dirname);
let targetfile;
let RootPATH = __dirname;
let curProcess;
let isHTML = false;

exports.root = (req, res)=> {
    let curdir = parseDir.parserDir(targetDir)
    let curfile = parseDir.parserFile(targetDir)
    res.render('index', {
        title: 'app',
        curDir: curdir,
        curfile: curfile,
        file: 'http://localhost:3001/',
        filetext: targetfile,
        isHTML: isHTML
    })
}

exports.rootDir = express.static('./')

exports.font = (req, res) => {
    res.sendFile(`${__dirname}/font/` + req.params["font"])
}
exports.css = (req, res)=> {
    res.sendFile(`${RootPATH}/css/style.css`)
}
exports.csss = (req, res)=> {
    res.sendFile(`${__dirname}/css/` + req.params["csss"])
}
exports.img = (req, res)=> {
    res.sendFile(`${__dirname}/img/` + req.params["imgg"])
}
exports.script = (req, res)=> {
    res.sendFile(`${__dirname}/app/` + req.params["jsfiles"])
}

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

exports.openFile = (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let curCommand = JSON.parse(JSON.stringify(req.body));
    let pathToFile = path.resolve(targetDir, curCommand.but1)
    let pathToFileStart = path.resolve(targetDir, 'server.js')
    isHTML = false
    let format = curCommand.but1.split('.').at(-1),
        command = "const express = require('express');const process = require('process');const app = express();app.use('/', express.static('./'));app.listen(3001, ()=>console.log(process.pid));"
    
    fs.readFile(pathToFile, (err, data)=> {
        targetfile = data.toString()
    })

    if (curProcess != undefined) {
        
        process.kill(curProcess)
        curProcess = undefined
    }
    console.log(curProcess)
    if (format == 'html') {
        
        isHTML = true
        fs.writeFile(pathToFileStart, data=command, (err) => {
            if(err) {
                return;
            }
            child_process.exec(`node ${pathToFileStart}`, {
                cwd: targetDir, 
                signal: signal,
                timeout: 1000
            }, (err, stdout, stderr) => {
                curProcess = stdout;
            })

            
        })
    }
    
    res.redirect('/')
}