var router = require('express').Router();

// split up route handling
router.use('/courses', require('./courses'));

// etc.

module.exports = router;
