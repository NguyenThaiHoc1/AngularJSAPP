var router = require('express').Router();
var authMiddleware = require('../middleware/authMiddleware.js');

router.use('/', require('./index/index.js'));
router.use('/common', require('./common'));
router.use('/trainee', authMiddleware.ensureAuthenticated, authMiddleware.ensureTraineePrivilege, require('./trainee'));
router.use('/trainer', authMiddleware.ensureAuthenticated, authMiddleware.ensureTrainerPrivilege, require('./trainer'));
router.use('/admin', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdminPrivilege, require('./admin'));
router.use('/user', authMiddleware.ensureAuthenticated, require('./user'));


// router.use('/', require('./index/index.js'));
// router.use('/common', require('./common'));
// router.use('/trainee', require('./trainee'));
// router.use('/trainer', require('./trainer'));
// router.use('/admin', require('./admin'));
// router.use('/user', require('./user'));
// router.use('/notiModule', require('./notiModule'));

module.exports = router;
