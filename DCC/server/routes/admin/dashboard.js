var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/logConfig');

router.get('/getAdminRequestOpenCourse', function (req, res) {
    var query =
        {
            include: [models.RequestOpening]
        };

    models.Course.findAll(query).then(function (courses) {
        var resData = [];
        courses.forEach(course => {
            if (course.RequestOpenings.length > 0) {
                var requestUsers = [];
                course.RequestOpenings.forEach(request => {
                    requestUsers.push(request.userId);
                });
                resData.push({
                    course: {
                        id: course.id,
                        name: course.name,
                        description: course.description,
                        imgLink: course.imgLink,
                    },
                    numberOfRequest: course.RequestOpenings.length,
                    traineeList: requestUsers
                });
            }
        });

        var datasend = {
            success: true,
            msg: 'send list success',
            data: resData
        };
        res.send(datasend);
    });

});

router.get('/setAdminRole', function (req, res) {
    models.User.update({
        isAdmin: 1,
        isTrainer: 1
    }, {
            where: {
                id: 1
            }
        }
    );
});

router.get('/getAllUsers', function (req, res) {
    models.User.findAll().then(function (data) { res.send(data) });

});


// router.get('/updatePW', function (req, res) {
//     models.User.update({
//         password: ""
//     }, {
//             where: { id: 1 }
//         }
//     );
// });
module.exports = router;
