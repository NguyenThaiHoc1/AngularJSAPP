var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
// process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');



describe('<Unit test for user profile>', function () {
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
    describe('Test case 1 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo');
            req.send(
                {
                    email: "qwe@gmail.com"
                }
            );
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.1 : Get /user/userProfile/getUserInfo for currentRole = 2 ', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo');
            req.send(
                {
                    email: "thach@gmail.com"
                }
            );
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.role, 2);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.2 : Get /user/userProfile/getUserInfo for currentRole = 3 ', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo');
            req.send(
                {
                    email: "bqd@gmail.com"
                }
            );
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.role, 3);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'qwe@gmail.com',
                username: 'Thao test',
                status: 'test status',
                avatar: '/img/profiles/defaultProfile.jpg',
                dob: '01/01/2001',
                phone: '0000 000 000',
                password: null

            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'Your name',
                    status: 'some status',
                    avatar: '/img/profiles/udefaultProfile.jpg',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    password: null
                }, {
                        where: { email: 'qwe@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 3 : Post /user/userProfile/photo', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/photo');
            req.cookies = Cookies;
            req.field('filename', 'test file');
            req.attach('userPhoto', 'test/routes/user/test.jpg');
            req.send({
                email: 'qwe@gmail.com'
            });
            req.end(function (err, res) {
                assert.equal(res.status, '302');
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 4.1 : post /user/userProfile/addUser', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/addUser');
            req.send({
                email: 'xyz@gmail.com',
                password: '123',
                userType: 'CBA'
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                //xoa user 
                models.User.destroy({
                    where: {
                        email: 'xyz@gmail.com'
                    }
                });

                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 4.2 : create user false post /user/userProfile/addUser', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/addUser');
            req.send({
                email: 'qwe@gmail.com',
                password: '123',
                courseId: 'DCC'
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
    //Test change password for user from Ldap server
    describe('Test case 5 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'qwe@gmail.com',
                username: 'Changed name',
                status: 'Changed status',
                avatar: '/img/profiles/udefaultProfile.jpg',
                dob: '01/01/2001',
                phone: '0000 000 000',
                password: null


            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'Your Name',
                    status: 'some status',
                    avatar: '/img/profiles/udefaultProfile.jpg',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    password: null
                }, {
                        where: { email: 'qwe@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 6: get all users by admin /user/userProfile/getAllUsers', function () {
        return it('Should return sucess==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getAllUsers');
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    //Test edit user profile with vietnamese names
    describe('Test case 7 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'qwe@gmail.com',
                username: 'Thử Tiếng Việt',
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'Quan WE'
                },
                    {
                        where: { email: 'qwe@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
});
describe('<Unit test for manual added user profile>', function () {
    var Cookies;

    beforeEach(function (done) {
        request(DCC_Server)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'tranhoangnam3108@gmail.com',
                password: 'nam'
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
    //test update password
    describe('Test case 1 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'tranhoangnam3108@gmail.com',
                username: 'Nam test',
                status: 'test status',
                avatar: '/img/profiles/userPhoto-1488169863745developer-icon.jpg',
                dob: '31/08/1995',
                phone: '0123456789',

                password: 'newpassword'
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'Nam Tran',
                    status: 'Bug Breeder',
                    avatar: '/img/profiles/userPhoto-1488169863745developer-icon.jpg',
                    dob: '31/08/1995',
                    phone: '0123456789',
                    password: 'nam'
                }, {
                        where: { email: 'tranhoangnam3108@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
});
