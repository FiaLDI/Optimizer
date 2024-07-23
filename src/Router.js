const express = require('express');
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});

const controller = require('./Controller')

router.use('/', controller.rootDir)
router.get('/', controller.root)
router.get('/mycss', controller.css);


router.post("/changepath", urlencodedParser, controller.changePath);
router.post("/rootpath", urlencodedParser, controller.rootPath);
router.post("/back", urlencodedParser, controller.backPath);
// router.post("/openfile", urlencodedParser, controller.openFile);
router.post("/setpath",  urlencodedParser, controller.setPath);
router.post("/downloaddep", urlencodedParser, controller.downloadDep);
router.post("/startserver", urlencodedParser, controller.startServer);
router.post("/stopserver", urlencodedParser, controller.stopServer);
router.post("/selectpage", urlencodedParser, controller.selectPage);
router.post("/optimize", urlencodedParser, controller.selectScripts)
router.post("/scriptedit", urlencodedParser, controller.scriptEdit)

module.exports = router;