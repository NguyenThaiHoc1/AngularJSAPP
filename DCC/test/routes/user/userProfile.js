var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');



describe('<Unit test for user profile>', function() {
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

    describe('Test case 1 : Get /user/userProfile/getUserInfo', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/user/userProfile/getUserInfo');
            req.cookies = Cookies;
            req.end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Get /user/userProfile/updateUserProfile', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'qwe@gmail.com',
                username: 'Thao test',
                status: 'test status'
            });
            req.cookies = Cookies;
            req.end(function(err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'Your name',
                    status: 'some status'
                },{
                    where:{email:'qwe@gmail.com'}
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 3 : Get /user/userProfile/photo', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).post('/user/userProfile/photo');
            req.cookies = Cookies;
            req.field('filename', 'test file');
            req.attach('userPhoto', 'test/routes/user/test.jpg');
            req.send({
                email: 'qwe@gmail.com'
            });
            req.end(function(err, res) {
                assert.equal(res.status, '302');
                if (err) return done(err);
                done();
            });
        });
    });
});
