var router = require('express').Router();
var authMiddleware = require('../middleware/authMiddleware.js');

// router.use('/', require('./index/index.js'));
// router.use('/common',  require('./common'));
// router.use('/trainee', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdminPrivilege, require('./trainee'));
// router.use('/trainer', authMiddleware.ensureAuthenticated, authMiddleware.ensureTrainerPrivilege, require('./trainer'));
// router.use('/admin', authMiddleware.ensureAuthenticated, authMiddleware.ensureTraineePrivilege, require('./admin'));
// router.use('/user', authMiddleware.ensureAuthenticated, require('./user'));

router.use('/', require('./index/index.js'));
router.use('/common',  require('./common'));
router.use('/trainee', authMiddleware.ensureAuthenticated, require('./trainee'));
router.use('/trainer', authMiddleware.ensureAuthenticated, require('./trainer'));
router.use('/admin', authMiddleware.ensureAuthenticated, require('./admin'));
router.use('/user', authMiddleware.ensureAuthenticated, require('./user'));

module.exports = router;
