var router = require('express').Router();
var authMiddleware = require('../middleware/authMiddleware.js');

router.use('/', require('./index/index.js'));
router.use('/common', require('./common'));
router.use('/trainee', require('./trainee'));
router.use('/trainer', require('./trainer'));
router.use('/admin', require('./admin'));
router.use('/user', require('./user'));


module.exports = router;
