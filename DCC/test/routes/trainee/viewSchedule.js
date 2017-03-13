var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = 'inMemoryDB';
var DCC_Server = require('../../../app.js');


describe('<Unit test for view schedule function>', function () {
    var Cookies;

    beforeEach(function (done) {
        request(DCC_Server)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'thach@gmail.com',
                password: '123456'
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
    describe('', function () {
        return it('It should return true ', function (done) {
            var req = request(DCC_Server).post('/trainee/viewSchedule/getEnrolledCourseList');
            req.cookies = Cookies;
            req
                .set('Accept', 'application/json')
                .send({
                    userId: 1
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });

});
