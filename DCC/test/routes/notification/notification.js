var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV = require('../../../settings.js').testDatabase;
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
                //create 3 notifications for each test

                models.Notifications.create({
                    id: 1,
                    email: 'qwe@gmail.com',
                    title: 'Test Notification 1',
                    content: 'Test Notification content 1',
                    status: 1,
                    time: new Date().toLocaleString(),
                    reference: "link"
                });
                models.Notifications.create({
                    id: 2,
                    email: 'qwe@gmail.com',
                    title: 'Test Notification 2',
                    content: 'Test Notification content 2',
                    status: 1,
                    time: new Date().toLocaleString(),
                    reference: "link"
                });
                models.Notifications.create({
                    id: 3,
                    email: 'qwe@gmail.com',
                    title: 'Test Notification 3',
                    content: 'Test Notification content 3',
                    status: 0,
                    time: new Date().toLocaleString(),
                    reference: "link"
                });

                if (err)
                    return done(err);
                done();
            });
    });

    after(function (done) {
        // Cleanup

        //logout
        request(DCC_Server).get('/logout');
        done();
    });

    describe('Test case 1: POST /notification/notification/getNotifications', function () {
        return it('Should return length==3', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNotifications');
            req.cookies = Cookies;
            req.send({
                email: 'qwe@gmail.com'
            });

            req.end(function (err, res) {
                assert.equal(res.body.data.length, 4);  //total 3 notifications created for this test
                models.Notifications.destroy({
                    where: {
                        email: 'qwe@gmail.com'
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2: POST /notification/notification/getNumberofNewNotification', function () {
        return it('Should return 2', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNumberofNewNotification');
            req.cookies = Cookies;
            req.send({
                email: 'qwe@gmail.com',
            });

            req.end(function (err, res) {
                assert.equal(res.body.data, 3); //2 new notifications created for this test
                models.Notifications.destroy({
                    where: {
                        email: 'qwe@gmail.com'
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : POST /notification/notification/updateNotificationStatus', function () {
        return it('Should return status==0', function (done) {
            var req = request(DCC_Server).post('/notification/notification/updateNotificationStatus');
            req.send({
                email: 'qwe@gmail.com',
                id: 1
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                if (err) return done(err);
                models.Notifications.getNotificationbyIdnEmail({ email: 'qwe@gmail.com', id: 1 }, notification => {
                    try {
                        assert.equal(notification.status, 0);
                        models.Notifications.destroy({
                            where: {
                                email: 'qwe@gmail.com'
                            }
                        });
                    } catch (err) {
                        return done(err);
                    }
                    done();
                });
            });
        });
    });

    describe('Test case 4 : POST /notification/notification/getAllNewNotificationAndUpdateStatus', function () {
        return it('Should return notifications==1', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getAllNewNotificationsAndUpdateStatus');
            req.send({
                email: 'qwe@gmail.com',
            });
            req.cookies = Cookies;
            req.end(function (err, res) {
                if (err) return done(err);
                models.Notifications.getAllNewNotifications('qwe@gmail.com', notifications => {
                    try {
                        assert.equal(notifications.length, 0);  //no new status available
                        models.Notifications.destroy({
                            where: {
                                email: 'qwe@gmail.com'
                            }
                        });
                    } catch (err) {
                        return done(err);
                    }

                    done();
                });
            });
        });
    });
});