var router = require('express').Router();

// split up route handling
router.use('/noti_email', require('./noti_email'));

// etc.

module.exports = router;
