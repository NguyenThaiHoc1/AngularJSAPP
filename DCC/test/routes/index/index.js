var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');

describe('<Unit test for Login>', function() {

    describe('Test case 1 : Login success', function() {
        return it('Should return success==true', function(done) {
            request(DCC_Server)
            .post('/login')
            .send({
                username: 'qwe@gmail.com',
                password: 'qwe'
            })
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Login fail, username true, password false', function() {
        return it('Should return success==false', function(done) {
            request(DCC_Server)
            .post('/login')
            .send({
                username: 'qwe@gmail.com',
                password: 'wrong password'
            })
            .end(function(err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Login fail, username false, password true', function() {
        return it('Should return success==false', function(done) {
            request(DCC_Server)
            .post('/login')
            .send({
                username: 'wrong user name',
                password: 'qwe'
            })
            .end(function(err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4 : Login fail, username false, password false', function() {
        return it('Should return success==false', function(done) {
            request(DCC_Server)
            .post('/login')
            .send({
                username: 'wrong user name',
                password: 'wrong user password'
            })
            .end(function(err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

});

describe('<Unit test for Logout>', function() {
    return it('Should return success==true, and destroy client session on server', function(done) {
        request(DCC_Server)
        .get('/logout')
        .end(function(err, res) {
            assert.equal(res.body.success, true);
            if (err) return done(err);
            done();
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
