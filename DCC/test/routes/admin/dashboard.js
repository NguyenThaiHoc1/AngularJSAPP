var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = 'inMemoryDB';
var DCC_Server = require('../../../app.js');

describe('<Unit test for admin-dashboard>', function () {
    var Cookies;

    beforeEach(function (done) {
        request(DCC_Server)

            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'qwe@gmail.com', //admin account!!!
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

    describe('Test case 1 : Get request open course for admin', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/dashboard/getAdminRequestOpenCourse');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });



});
