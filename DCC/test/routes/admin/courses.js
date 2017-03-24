var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = require('../../../settings.js').testDatabase;
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');

describe('<Unit test for admin-course>', function () {
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
    describe('Test case 14 : get /admin/courses/getAllCourse', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getAllCourse');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1 : Post /admin/courses/addCourse', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addCourse');
            req.cookies = Cookies;
            req.send({
                name: 'test creat name course',
                description: 'test creat name description',
                duration: '00:00:00',
                test: 'test creat test',
                documents: 'test creat documents',
                trainingProgramId: 1,
                imgLink: "/img/trainingProgram/training-icon-1.svg"

            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.Course.destroy({ where: { name: "test creat name course" } });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1.1 : Post /admin/courses/addCourse with courseName is already existed ', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addCourse');
            req.cookies = Cookies;
            req.send({
                name: 'Training Overview',
                description: 'test creat name description',
                duration: 'test creat duration',
                test: 'test creat test',
                documents: 'test creat documents',
                trainingProgramId: { id: 1 },
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Post /admin/courses/updateCourse', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateCourse');
            req.cookies = Cookies;
            req.send({
                id: 1,
                name: 'test update name course',
                description: 'test update name description',
                duration: '00:00:00',
                test: 'test update test',
                documents: 'test update documents',
                trainingProgramId: 1,
                imgLink: "/img/trainingProgram/training-icon-1.svg"
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.Course.update({
                    name: 'Training Overview',
                    description: 'Brief overview for all training courses',
                    duration: '00:00:00',
                    test: '',
                    documents: '',
                    trainingProgramId: 1,
                    imgLink: '/img/trainingProgram/training-icon-1.svg',
                }, {
                        where: {
                            id: 1
                        }
                    });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Post /admin/courses/deleteCourse', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteCourse');
            req.cookies = Cookies;
            req.send({
                id: 36,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.Course.create({
                    id: 36,
                    name: 'IMS Project Overview',
                    description: '- IMS teams',
                    duration: '02:00:00',
                    test: 'This is a test of IMS Project Overview course',
                    documents: 'This is a document of IMS Project Overview course',
                    trainingProgramId: 5,
                    imgLink: '/img/courses/training-icon-3.svg',
                });
                if (err) return done(err);
                done();
            });
        });
    });


    describe('Test case 5 : get Course Type List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getCourseTypeList');
            req.cookies = Cookies;
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6 : get Training Program List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getTrainingProgramList');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 7 : Post /admin/courses/addTrainingProgram Success', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addTrainingProgram');
            req.cookies = Cookies;
            req.send({
                name: 'test creat name of new training program',
                description: 'test creat name description',
                courseTypeId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.TrainingProgram.destroy({ where: { name: "test creat name of new training program" } });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 7.1 : Post /admin/courses/addTrainingProgram fail becuz Name is already existed ', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addTrainingProgram');
            req.cookies = Cookies;
            req.send({
                name: 'Linux Programming',
                description: 'test creat name description',
                courseTypeId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 8 : Post /admin/courses/updateTrainingProgram', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateTrainingProgram');
            req.cookies = Cookies;
            req.send({
                id: 1,
                name: 'test update name of new training program',
                description: 'test update name description',
                courseTypeId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.TrainingProgram.update({
                    name: 'General Orientation',
                    description: 'description of General Orientation trainning program 1 ',
                    courseTypeId: 1,
                }, {
                        where: {
                            id: 1
                        }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 9 : Post /admin/courses/deleteTrainingProgram', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteTrainingProgram');
            req.cookies = Cookies;
            req.send({
                id: 6,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.TrainingProgram.create({
                    id: 6,
                    name: 'IMS Overview',
                    description: 'Description of IMS Overview',
                    imgLink: '/img/courses/training-icon-3.svg',
                    courseTypeId: 5,
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 10 : Get Class List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/getClass');
            req.cookies = Cookies;
            req.send({
                courseId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 11 : Post /admin/courses/addClass Success', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;

            models.RequestOpening.create({
                courseId: 10,
                userId: 1,
            });

            req.send({
                courseId: 10,
                startTime: '2018-08-03 17:00:00',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Class.destroy({
                    where: { courseId: 10 }
                })
                models.RequestOpening.destroy({
                    where: {
                        courseId: 10, userId: 1
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11.1 : Post /admin/courses/addClass Fail', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            models.Class.create({
                courseId: 4,
                startTime: '2018-02-03 14:00:00',
            });
            req.send({
                courseId: 4,
                startTime: '2018-02-03 18:00:00',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                models.Class.destroy({
                    where: { courseId: 4 }
                })
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 12 : Post /admin/courses/updateClass', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateClass');
            req.cookies = Cookies;


            req.send({
                id: 1,
                courseId: '1',
                location: 'test update loc',
                startTime: '2017-02-03 17:00:00',
                duration: '2',
                maxAttendant: '12',
                note: 'test crat note'
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.Class.update({
                    courseId: '1',
                    location: 'L09',
                    startTime: '2017-02-03 17:00:00',
                    duration: '2',
                    maxAttendant: '12',
                    note: ''
                }, {
                        where: {
                            id: 1
                        }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 13 : Post /admin/courses/deleteClass', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteClass');
            req.cookies = Cookies;
            req.send({
                id: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.Class.create({
                    id: 1,
                    courseId: '1',
                    location: 'L09',
                    startTime: '2017-02-03 17:00:00',
                    duration: '2',
                    maxAttendant: '12',
                    note: ''
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 15 : get /admin/courses/getAllTP', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getAllTP');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
});
