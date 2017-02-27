var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');


describe('<Unit test for feedback function>', function() {
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
    describe('', function() {
        return it('Test case 1 : Create a Feedback (cmt & rating) for Class that doesnt have comment ', function(done) {
            var req = request(DCC_Server).post('/trainee/feedback/getMyFeedbackByClass');
            req.cookies = Cookies;
            req
            .set('Accept', 'application/json')
            .send({
                classId: 1,
                comment: 'create test feedback',
                traineeId: 1,
                rating: 3
            })
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

 

    describe('', function() {
        return it('Test case 2 : Update Feedback (cmt & rating) for Class having comment already', function(done) {
            var req = request(DCC_Server).post('/trainee/feedback/sendFeedback');
            req.cookies = Cookies;
            req
            .set('Accept', 'application/json')
            .send({
                classId: 1,
                comment: 'update feedback',
                traineeId: 1,
                rating: 3
            })
            .end(function(err,res){
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            })
        });
    });
    describe('', function() {
        return it('Test case 3 : get feedback POST /trainee/feedback/getMyFeedbackByClass', function(done) {
            var req = request(DCC_Server).post('/trainee/feedback/getMyFeedbackByClass');
            req.cookies = Cookies;
            req
            .set('Accept', 'application/json')
            .send({
                classId: 4,
                traineeId: 1,
            })
            .end(function(err, res) {
                assert.equal(res.body.success, true);
                console.log(res.body.feedback);
                if (err) return done(err);
                done();
            });
        });
    });

});
