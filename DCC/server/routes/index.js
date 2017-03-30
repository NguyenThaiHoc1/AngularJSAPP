var router = require('express').Router();
var authMiddleware = require('../middleware/authMiddleware.js');
/* try to avoid code smell
router.use('/', require('./index/index.js'));
router.use('/common', require('./common'));
router.use('/trainee', authMiddleware.ensureAuthenticated, authMiddleware.ensureTraineePrivilege, require('./trainee'));
router.use('/trainer', authMiddleware.ensureAuthenticated, authMiddleware.ensureTrainerPrivilege, require('./trainer'));
router.use('/admin', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdminPrivilege, require('./admin'));
router.use('/user', authMiddleware.ensureAuthenticated, require('./user'));
router.use('/notification', authMiddleware.ensureAuthenticated, require('./notification'));
hope it works */

router.use('/', require('./index/index.js'));
router.use('/common', require('./common'));
router.use('/trainee', require('./trainee'));
router.use('/trainer', require('./trainer'));
router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/notification', require('./notification'));

module.exports = router;
