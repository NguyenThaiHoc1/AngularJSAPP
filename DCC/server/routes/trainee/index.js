var router = require('express').Router();

// split up route handling
router.use('/dashboard', require('./dashboard'));
router.use('/courseRegister', require('./courseRegister'));

// etc.

module.exports = router;
