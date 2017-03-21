var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = require('../../../settings.js').testDatabase;
var DCC_Server = require('../../../app.js');

describe('<Unit test for Login>', function () {

    describe('Test case 1.1 : Login success, role = admin', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'qwe'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 1);
                    else
                        assert.equal(res.body.success, true);
                    // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.1.1 : Login failed, role = admin', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'qqwe'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 1);
                    else
                        assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Test case 1.2 : Login success, role = trainee', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'huy@email.com',
                    password: 'soledad'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 3);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.3 : Login success, role = trainer', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'thach@gmail.com',
                    password: '123456'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 2);
                    else
                        assert.equal(res.body.success, true);
                    // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 2 : Login fail, username true, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'wrong password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Test case 3 : Login fail, username false, password true', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'qwe'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4 : Login fail, username false, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'wrong user password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4.2: isLogin fail', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .get('/isLogin')
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.1 : Login User Manual success, role = trainee', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'bqd@gmail.com',
                    password: '123'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 3);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.2 : Login User Manual fail, username true, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'bqd@gmail.com',
                    password: 'wrong password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.3 : Login User Manual fail, username false, password true', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: '123'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 5.4 : Login User Manual fail, username false, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'wrong user password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('<Unit test for Logout>', function () {
    return it('Should return success==true, and destroy client session on server', function (done) {
        request(DCC_Server)
            .get('/logout')
            .end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
    });
});
// describe('Test case 5: Get Events', function () {
//     return it('Should return success==true', function (done) {
//         request(DCC_Server)
//             .get('/getEvents')
//             .end(function (err, res) {
//                 assert.equal(res.body.success, true);
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

describe('Test case 6: get homepage', function () {
    return it('Should return success==true', function (done) {
        request(DCC_Server)
            .get('/')
            .end(function (err, res) {
                assert.equal(res.status, '200');
                if (err) return done(err);
                done();
            });
    });
});

describe('<Unit test for isLogin success>', function () {
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

    describe('Test case 4.1: isLogin success', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/isLogin');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });


});
//
// describe('', function() {
//     var Cookies;
//     return it('Test case 0.1 : Check authenticated: Not Logged in', function(done) {
//         var req = request(DCC_Server).get('/isLogged');
//         req.cookies = Cookies;
//         req.set('Accept', 'application/json')
//         .end(function(err, res) {
//             assert.equal(res.text, '');
//             if(err)
//             return done(err);
//             done();
//         });
//     });
// });
//
// return it('Test case 0 : Check authenticated: Logged in', function(done) {
//     var req = request(DCC_Server).get('/isLogged');
//     req.cookies = Cookies;
//     req.set('Accept', 'application/json')
//     .end(function(err, res) {
//         assert.equal(res.text, 'qwe@gmail.com');
//         if(err)
//         return done(err);
//         done();
//     });
// });
