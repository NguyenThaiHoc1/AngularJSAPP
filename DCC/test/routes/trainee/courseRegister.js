var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');



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

    beforeEach(function(done) {
        request(DCC_Server)
        .get('/trainee/courseRegister/createTest')
        .set('Accept', 'application/json')
        .end(function(err, res) {
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
            var req = request(DCC_Server).get('/trainee/courseRegister/getTrainingProgram')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Get Opening Class', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getOpeningClass')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Get Request Course', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server)
            .post('/trainee/courseRegister/getRequestedOpeningCourse')
            .set('Accept', 'application/json')
            .send({userEmail: "qwe@gmail.com"})
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
            .post('/trainee/courseRegister/sendRegisterRequest')
            .set('Accept', 'application/json')
            .send({userEmail:"qwe@gmail.com", courseId: 5})
            .end(function(err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

});
