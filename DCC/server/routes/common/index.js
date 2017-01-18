var router = require('express').Router();

// split up route handling
router.use('/course', require('./course'));

// etc.

module.exports = router;
