var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = require('../../../settings.js').testDatabase;
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');



describe('<Unit test for trainee-courseRegister>', function () {
    var Cookies;

    beforeEach(function (done) {
        request(DCC_Server)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'qwe@gmail.com',
                password: 'qwe'
            })
            .end(function (err, res) {
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                if (err)
                    return done(err);
                done();
            });
    });



    afterEach(function (done) {
        // Cleanup
        //logout
        request(DCC_Server).get('/logout')
        done();
    });

    describe('Test case 1 : Get training programs', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getTrainingProgram');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 2 : Get Opening Class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getOpeningClass');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Get Request Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/getByUserID');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 2 })
                .end(function (err, res) {

                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4 : Send Register Request: Request is existed', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 2, courseId: 5 })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Test case 5 : Send Register Request: Request is not existed, request-type is join (class is not opening)', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 36 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.RequestOpening.destroy({ where: { userId: 1, courseId: 36 } });
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 6 : Send Register Request: Request is already existed, request-type is register (class is not opening)', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            models.RequestOpening.create({
                userId: 1,
                courseId: 10,
                requestType: "register"
            })
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 10 })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    models.RequestOpening.destroy({
                        where: {
                            courseId: 10
                        }
                    });
                    if (err) return done(err);
                    done();
                });

        });
    });

    describe('Test case 6.1 : Send Register Request: class is opening, enroll success', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 8 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.ClassRecord.destroy({
                        where: {
                            classId: 20,
                            traineeId: 1
                        }
                    });
                    if (err) return done(err);
                    done();
                });

        });
    });

    describe('Test case 7 : Send Register Request: Request enroll fail, user aleardy enrolled (class is not opening)', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 2 })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 8 : Delete Request Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/deleteRequestOpening');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ userId: 2, courseId: 2 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.RequestOpening.create({ userId: 2, courseId: 2, requestType: 'register' });
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 9 : Un-enroll Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/unEnrollCourse');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .send({ traineeId: 2, classId: 3 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.ClassRecord.create({ classId: 3, traineeId: 2, status: 'Enrolled', id: 3 });
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 10 : Get my enroll class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/getMyEnrolledClass');
            req.send({ email: "thach@gmail.com" });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11 : update ClassRecord status from Enrolled to Learned', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/updateClassRecordStatus');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            req.send({
                classId: 3,
                traineeId: 2
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 12: get Course by Name /trainee/courseRegister/getCoursebyName', function () {
        return it('Should return id==1', function (done) {
            var req = request(DCC_Server).post('/trainee/courseRegister/getCoursebyName');
            req.cookies = Cookies;
            req.send({
                name: 'Training Overview'
            })
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    try {
                        assert.equal(res.body.course.id, 1); //Training Overview has id = 1
                    } catch (error) {
                        return done(error);
                    }
                    done();
                });

        });
    });
});
