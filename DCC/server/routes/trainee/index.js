var router = require('express').Router();

// split up route handling
router.use('/dashboard', require('./dashboard'));
router.use('/courseRegister', require('./courseRegister'));
router.use('/feedback', require('./feedback'));
router.use('/viewSchedule', require('./viewSchedule'));

// etc.

module.exports = router;
