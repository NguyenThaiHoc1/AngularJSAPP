var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/logConfig');

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

router.get('/getUserInfo', function (req, res) {
    log.info('GET /users/getUserInfo');
    models.User.getUserByEmail(req.user.email, function (user) {
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
            status: req.body.status,
            dob: req.body.dob,
            phone: req.body.phone,
            role: req.body.role
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
        }
        else {
            res.redirect('/#/editUserProfile');
        }

    });
});

module.exports = router;
