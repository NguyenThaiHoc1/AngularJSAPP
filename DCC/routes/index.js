var express = require('express');
var router = express.Router();
var delog = require('../delog');
// get homepage
router.get('/',function(req, res){
    //res.render('index');
    res.statusCode = 200;
    res.end()
  });

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
}
module.exports = router;
