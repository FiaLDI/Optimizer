const express = require('express');
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});

const controller = require('./Controller')

router.use('/', controller.rootDir)
router.get('/', controller.root)

// router.get('/font/:font', controller.font)
router.get('/mycss', controller.css);
// router.get('/css/:csss', controller.csss);
// router.get('/img/:imgg', controller.img);
// router.get('/ru/:imgg', controller.img);
// router.get('/app/:jsfiles', controller.script);



router.post("/changepath", urlencodedParser, controller.changePath)
router.post("/rootpath", urlencodedParser, controller.rootPath);
router.post("/back", urlencodedParser, controller.backPath);

router.post("/openfile", urlencodedParser, controller.openFile);

module.exports = router;