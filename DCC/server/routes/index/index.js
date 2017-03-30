var express = require('express');
var router = express.Router();
var gcal = require('../../config/google_api/gcal.js');
var log = require('../../config/config')["log"];
var Sequelize = require('sequelize');
var ldap = require('ldapjs');
var models = require('../../models');
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;
// admin's credentials for connecting to openLDAP server
var BASE_OPTS = require("../../config/config");
var md5 = require('md5');

// get homepage
router.get('/', function (req, res) {
    res.render('./index');
});

router.get('/getEvents', function (req, res) {
    gcal.getEvents(function (eventList) {
        res.send({
            success: true,
            eventList: eventList
        });
    });
});

// passport Strategy
passport.use(new LdapStrategy(BASE_OPTS, function (user, callback) {
    // if authenticate success, user is returned here
    return callback(null, user);
}));


router.post('/login', function (req, res, next) {
    log.info('Post /login');
    passport.authenticate('ldapauth', {
        // using session to save user's credentials
        session: true
    }, function (err, user) {
        // if err, log err
        if (err) {
            log.error(err);
            return next();
        }
        else {
            // if user does not exist, login fail
            if (!user) {

                models.User.getUserByEmailAndPassword(req.body.username, md5(req.body.password), function (_user) {
                    if (_user && _user.status !== 'deactivated') {
                        passport.serializeUser(function (_user, done) {
                            done(null, _user.email);
                        });
                        // get user's credentials from session
                        passport.deserializeUser(function (email, callback) {
                            callback(null, {
                                email: email
                            });
                        });
                        return req.login(_user, function (err) {
                            if (err) {
                                log.error(err);
                                return next();
                            }
                            log.info('User login: ' + _user.email);
                            var currentRole = _user.isAdmin ? 1 :
                                              _user.isTrainer ? 2 :
                                              _user.isTrainee ? 3 : 0;

                            res.send({
                                id: _user.id,
                                username: _user.username,
                                status: _user.status,
                                dob: _user.dob,
                                phone: _user.phone,
                                location: _user.location,
                                email: _user.email,
                                password: _user.password,
                                avatar: _user.avatar,
                                role: currentRole,
                                isAdmin: _user.isAdmin,
                                isTrainer: _user.isTrainer,
                                isTrainee: _user.isTrainee, //default user is a trainee
                                trainer: _user.trainer,
                                trainee: _user.trainee,
                                belong2Team: _user.belong2Team,
                                isExperienced: _user.isExperienced,
                                userType: _user.userType,
                                isNotificationDesktop: _user.isNotificationDesktop,
                                isNotificationEmail: _user.isNotificationEmail,
                                EmailPeriod: _user.EmailPeriod,
                                TimeOption: _user.TimeOption,

                                success: true,
                                msg: 'You are authenticated!'
                            });
                        });
                    } else {
                        log.info('User login failed.');
                        res.send({
                            userid: null,
                            success: false,
                            msg: 'Wrong email or password',
                        });
                    }
                })

            } else {
                // save user's credentials to session
                passport.serializeUser(function (user, done) {
                    done(null, user.mail);
                });
                // get user's credentials from session
                passport.deserializeUser(function (email, callback) {
                    callback(null, {
                        email: email
                    });
                });

                // else login success
                return req.login(user, function (err) {
                    if (err) {
                        log.error(err);
                        return next();
                    }
                    else {
                        log.info('User login: ' + user.mail);
                        models.User.findOrCreate({
                            where: { email: req.user.mail },
                            defaults: {
                                username: 'Your Name',
                                status: 'activated',
                                dob: '01/01/2001',
                                phone: '0000 000 000',
                                location: 'DEK Vietnam',
                                email: req.user.mail,
                                //password: '',     //password null 
                                avatar: '/img/profiles/defaultProfile.jpg',
                                isAdmin: false,
                                isTrainer: false,
                                isTrainee: false, //default user is a trainee
                                belong2Team: 'Team Innova',
                                isExperienced: 0,
                                courseTypeId: 'CBA'
                            }
                        })
                            .then(function (user) {
                                var currentRole = user[0].dataValues.isAdmin ? 1 :
                                                  user[0].dataValues.isTrainer ? 2 :
                                                  user[0].dataValues.isTrainee ? 3 : 0;

                                res.send({
                                    id: user[0].dataValues.id,
                                    username: user[0].dataValues.username,
                                    status: user[0].dataValues.status,
                                    dob: user[0].dataValues.dob,
                                    phone: user[0].dataValues.phone,
                                    location: user[0].dataValues.location,
                                    email: user[0].dataValues.email,
                                    password: user[0].dataValues.password,
                                    avatar: user[0].dataValues.avatar,
                                    role: currentRole,
                                    isAdmin: user[0].dataValues.isAdmin,
                                    isTrainer: user[0].dataValues.isTrainer,
                                    isTrainee: user[0].dataValues.isTrainee, //default user is a trainee
                                    trainer: user[0].dataValues.trainer,
                                    trainee: user[0].dataValues.trainee,
                                    belong2Team: user[0].dataValues.belong2Team,
                                    isExperienced: user[0].dataValues.isExperienced,
                                    userType: user[0].dataValues.userType,
                                    isNotificationDesktop: user[0].dataValues.isNotificationDesktop,
                                    isNotificationEmail: user[0].dataValues.isNotificationEmail,
                                    EmailPeriod: user[0].EmailPeriod,
                                    TimeOption: user[0].TimeOption,

                                    success: true,
                                    msg: 'You are authenticated!'
                                });
                            });
                    }
                });
            }
        }
    })(req, res, next);
});

router.get('/isLogin', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            success: true,
            msg: "You are logged in"
        });
    } else {
        res.send({
            success: false,
            msg: "You are NOT logged in"
        });
    }
})

router.get('/logout', function (req, res) {
    // destroy session and redirect to homepage when logout
    log.info('GET /logout');
    req.logout();
    req.session.destroy();
    res.send({
        success: true,
        msg: "Logout successfully"
    });

});




module.exports = router;
