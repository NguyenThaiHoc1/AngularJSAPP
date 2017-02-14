var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');



describe('<Unit test for trainee-courseRegister>', function() {
    var Cookies;

    beforeEach(function(done) {
        request(DCC_Server)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
            username: 'qwe@gmail.com',
            password: 'qwe'
        })
        .end(function(err, res) {
            Cookies = res.headers['set-cookie'].pop().split(';')[0];
            if(err)
            return done(err);
            done();
        });
    });

    afterEach(function(done) {
        // Cleanup
        //logout
        request(DCC_Server).get('/logout')
        done();
    });

    describe('Test case 1 : Get training programs', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getTrainingProgram');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Get Opening Class', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getOpeningClass');
            req.cookies = Cookies;
            req.end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Get Request Course', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/getRequestedOpeningCourse');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({userId: 2})
            .end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4 : Send Register Request: Request is existed', function() {
        return it('Should return success==false', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({userId: 2, courseId: 5})
            .end(function(err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 5 : Send Register Request: Request is not existed, request-type is join (class is opening)', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({userId: 2, courseId: 3})
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                models.RequestOpening.destroy({where: {userId:2, courseId: 3}});
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6 : Send Register Request: Request is not existed, request-type is register (class is not opening)', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({userId:2, courseId: 4})
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                models.RequestOpening.destroy({where: {userId:2, courseId: 4}});
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 7 : Delete Request Course', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/deleteRequestOpening');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({userId:2, courseId: 2})
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                models.RequestOpening.create({userId:2, courseId: 2, requestType: 'register'});
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 8 : Un-enroll Course', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/unEnrollCourse');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({traineeEmail:"qwe@gmail.com", classId: 1})
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                models.ClassRecord.create({ classId: 1, traineeId: 1});
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 9 : Get my enroll class', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/getMyEnrolledClass');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
            .send({traineeEmail:"qwe@gmail.com"})
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

});
