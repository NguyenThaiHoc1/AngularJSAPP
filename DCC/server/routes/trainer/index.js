var router = require('express').Router();

// split up route handling
router.use('/feedback', require('./feedback'));

// etc.

module.exports = router;
