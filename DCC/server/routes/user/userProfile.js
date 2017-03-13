var router = require('express').Router();
var models = require('../../models');
var config = require('../../config/config.json');
var log = require('../../config/config')[config.logConfig];
var md5 = require('md5');
const fs = require('fs');
var notifier = require('node-notifier');

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
            getCurrentRole: true
        });
    });
});


router.post('/updateUserProfile', function (req, res) {
    log.info('/routes/users: Save edit userprofile');
    models.User.update(
        {
            username: req.body.username,
            // userType: req.body.userType,
            avatar: req.body.avatar,
            dob: req.body.dob,
            phone: req.body.phone,
            //role: req.body.role,
            password: md5(req.body.password),
            status: req.body.status
        },
        {
            where: { email: req.body.email }
        }
    ).then(function () {
        res.send({
            success: true,
            msg: "Update your profile Success"
        });
    });
});

router.post('/photo', function (req, res) {
    log.info('/routes/users: Upload avatar');
    // upload avatar
    upload(req, res, function () {
        if (typeof req.file !== "undefined") {
            models.User.getUserByEmail(req.user.email, function (user) {
                // if (user.avatar !== '/img/profiles/defaultProfile.jpg') {
                //     fs.unlink('client' + user.avatar, (err) => {

                //     });
                // }
                models.User.update(
                    {
                        avatar: '/img/profiles/' + req.file.filename
                    },
                    {
                        where: { email: req.user.email }
                    }
                ).then(function () {
                    res.redirect('/#/editUserProfile');
                })
            });
        }
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
        // this function check if the courseName is already existed
        models.User.getUserByEmail(req.body.email, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Email already existed. Add failed!'
                });
            } else {
                // console.log(md5('what the fack!'));
                models.User.create({
                    username: 'Your Name',
                    status: 'activated',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    location: 'DEK Vietnam',
                    email: req.body.email,
                    password: md5(req.body.password),
                    avatar: '/img/profiles/defaultProfile.jpg',
                    isAdmin: false,
                    isTrainer: false,
                    isTrainee: true, //default user is a trainee
                    belong2Team: 'Innova',
                    isExperienced: 0,
                    userType: req.body.userType,
                }).then(function () {
                    res.send({
                        success: true,
                        msg: "Add User Success",
                    });
                });
            }
        });
    });
});
router.post('/checkPassword', function (req, res) {
    models.User.findOne({ where: { email: req.body.email, password: md5(req.body.password) } }).then(function (result) {
        if (result) res.send({ success: true });
        else res.send({ success: false });
    })
});


module.exports = router;
