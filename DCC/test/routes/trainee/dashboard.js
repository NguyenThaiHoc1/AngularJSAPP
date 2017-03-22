var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = require('../../../settings.js').testDatabase;
var DCC_Server = require('../../../app.js');



describe('<Unit test for trainee-dashboard>', function () {
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

    describe('Test case 1.1 : Get training programs by TP Type: CBA', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.send({
                userType: 'CBA',
                isExperienced: '0',
                email: 'qwe@gmail.com',
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.2 : Get training programs by TP Type: IMS', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.send({
                userType: 'IMS',
                isExperienced: '0',
                email: 'newuser@email.com',
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Get request open course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/dashboard/getRequestOpenCourse');
            req.cookies = Cookies;
            req.send({ userId: 1 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                console.log(err);
                if (err) return done(err);
                done();
            });
        });
    });


});
