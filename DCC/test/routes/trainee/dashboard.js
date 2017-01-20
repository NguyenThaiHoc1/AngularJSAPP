var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');



describe('<Unit test for trainee-dashboard>', function() {
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
            var req = request(DCC_Server).get('/trainee/dashboard/getTrainingProgram');
            req.cookies = Cookies;
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1 : Get request open course', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/trainee/dashboard/getRequestOpenCourse');
            req.cookies = Cookies;
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });


});
