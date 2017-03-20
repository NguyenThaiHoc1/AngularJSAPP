var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = 'inMemoryDB';
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');

describe('<Unit test for notification>', function () {
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
        request(DCC_Server).get('/logout');
        done();
    });

    describe('Test case 1: POST /notification/notification/getNotifications', function() {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNotifications');
            req.cookies = Cookies;
            req.send({
                email: 'qwe@gmail.com'
            });

            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2: POST /notification/notification/getNewNotifications', function() {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNewNotifications');
            req.cookies = Cookies;
            req.send({
                email: 'qwe@gmail.com',
                status: 1
            });

            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
});