var models = require('../models');
var log = require('../../config/logConfig');

function getUserRole(userEmail){
    models.User.findOne({where:{email: userEmail}}).then(user =>{
        // console.log(user);
        return user.role;
    })
}

var authMiddleware = {
    ensureAuthenticated: function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }else{
            log.info('Receive unauthenticated request');
            res.send({
                success: false,
                msg: "You need to login first"
            });
        }
    },
    ensureAdminPrivilege: function ensureAdminPrivilege(req, res, next){
        if (req.isAuthenticated() && getUserRole(req.user.email) == 1) {
            return next();
        }else{
            log.info('Receive under-privilege request to admin route');
            res.send({
                success: false,
                msg: "You need Admin privilege to access this route"
            });
        }
    },
    ensureTrainerPrivilege: function ensureTrainerPrivilege(req, res, next){
        if (req.isAuthenticated() && getUserRole(req.user.email) == 1) {
            return next();
        }else{
            log.info('Receive under-privilege request to trainer route');
            res.send({
                success: false,
                msg: "You need Trainer privilege to access this route"
            });
        }
    },
    ensureTraineePrivilege: function ensureTraineePrivilege(req, res, next){
        if (req.isAuthenticated() && getUserRole(req.user.email) == 1) {
            return next();
        }else{
            log.info('Receive under-privilege request to trainee route');
            res.send({
                success: false,
                msg: "You need Trainee privilege to access this route"
            });
        }
    },


};


module.exports = authMiddleware;
