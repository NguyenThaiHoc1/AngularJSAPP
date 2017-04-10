var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var md5 = require('md5');
const fs = require('fs');
var sendEmail = require('../../notification/email');
var auto = require('../../automatic')
// Upload file setting
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './client/img/profiles');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage }).single('userPhoto');

// generate table to mysql
models.User.sync({
    force: false
});

router.post('/getUserInfo', function (req, res) {
    log.info('GET /users/getUserInfo');
    models.User.getUserByEmail(req.body.email, function (user) {
        var currentRole;
        if (user.isAdmin) {
            currentRole = 1;
        } else if (user.isTrainer) {
            currentRole = 2;
        } else if (user.isTrainee) {
            currentRole = 3;
        } else {
            currentRole = 0;
        }
        res.send({
            id: user.id,
            username: user.username,
            status: user.status,
            dob: user.dob,
            phone: user.phone,
            location: user.location,
            email: user.email,
            password: user.password,
            avatar: user.avatar,
            role: currentRole,
            isAdmin: user.isAdmin,
            isTrainer: user.isTrainer,
            isTrainee: user.isTrainee,
            belong2Team: user.belong2Team,
            isExperienced: user.isExperienced,
            userType: user.userType,
            success: true,
            getCurrentRole: true,
            isNotificationDesktop: user.isNotificationDesktop,
            isNotificationEmail: user.isNotificationEmail,
            EmailPeriod: user.EmailPeriod,
            TimeOption: user.TimeOption
        });
    });
});


router.post('/updateUserProfile', function (req, res) {
    log.info('/routes/users: Save edit userprofile');
    models.User.update(
        {
            username: req.body.username,
            avatar: req.body.avatar,
            dob: req.body.dob,
            phone: req.body.phone,
            status: req.body.status,
            isNotificationDesktop: req.body.isNotificationDesktop,
            isNotificationEmail: req.body.isNotificationEmail,
            isAdmin: req.body.isAdmin,
            isTrainer: req.body.isTrainer,
            isExperienced: req.body.isExperienced,
            EmailPeriod: req.body.EmailPeriod,
            TimeOption: req.body.TimeOption
        },
        {
            where: { email: req.body.email }
        }
    ).then(function () {
        auto.job_sendEmail.updateJobs(req.body.email);
        res.send({
            success: true,
            msg: "Update your profile Success"
        });
    });
});

router.post('/changePasswordMD5', function (req, res) {
    log.info('/routes/users: Save edit userprofile');
    models.User.update(
        {
            password: md5(req.body.password),
            status: 'activated',
            isTrainee: true
        },
        {
            where: { email: req.body.email }
        }
    ).then(function () {
        res.send({
            success: true,
            msg: "Update Your Password Success"
        });
    });
});

router.post('/photo', function (req, res) {
    log.info('/routes/users: Upload avatar');
    upload(req, res, function () {

        models.User.getUserByEmail(req.user.email, function (user) {
            models.User.update(
                {
                    avatar: '/img/profiles/' + req.file.filename
                },
                {
                    where: { email: req.user.email }
                }
            ).then(function () {
                var previousAvatar = user._previousDataValues.avatar;
                fs.unlink('client' + previousAvatar);
                res.redirect('/#/editUserProfile');
            })
        });

    });
});

router.get('/getAllUsers', function (req, res) {
    models.User.getAllUsers(users => {
        var dataSend = {
            success: true,
            msg: 'successfully sent',
            data: users
        };
        res.send(dataSend);
    });
});

router.post('/addUser', function (req, res) {
    models.User.sync({
        force: false
    }).then(function () {
        models.User.getUserByEmail(req.body.email, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Email already existed. Add failed!'
                });
            } else {
                models.User.create({
                    username: req.body.username,
                    status: 'newuser',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    location: 'DEK Vietnam',
                    email: req.body.email,
                    password: md5(req.body.password),
                    avatar: '/img/profiles/defaultProfile.jpg',
                    isAdmin: false,
                    isTrainer: false,
                    isTrainee: false,
                    belong2Team: req.body.team,
                    isExperienced: 0,
                    userType: req.body.userType,
                }).then(function () {

                    sendEmail([req.body.email], "Register - Account Information", "Your account has been registered as " + req.body.username + " using the email: " + req.body.email + " with the auto-generated password of: " + req.body.password + " . You must change your password the first time you login otherwise you won't be able to access other features.");
                    res.send({
                        success: true,
                        msg: "Register New User Successfully",
                    });
                });
            }
        });
    });
});
router.post('/checkPassword', function (req, res) {
    models.User.findOne({
        where:
        {
            email: req.body.email, password: md5(req.body.password)
        }
    }).then(result => {
        if (result)
            res.send({ success: true });
        else res.send({ success: false });
    });
});

module.exports = router;
