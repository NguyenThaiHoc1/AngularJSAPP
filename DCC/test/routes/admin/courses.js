var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
//process.env.NODE_ENV = 'test';
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');

describe('<Unit test for admin-course>', function() {
    var Cookies;

    beforeEach(function(done) {
        request(DCC_Server)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
            username: 'thach@gmail.com',
            password: '123456'
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

    describe('Test case 1 : Post /admin/courses/addCourse', function() {
        return it('Should return success==true', function(done) {

            var req = request(DCC_Server).post('/admin/courses/addCourse');
            req.cookies = Cookies;
            req.send({
                name: 'test creat name course',
                description: 'test creat name description',
                duration: 'test creat duration',
                test: 'test creat test',
                documents: 'test creat documents',
                courseTypeId: {id:1},
                trainingProgramId:{id:1},
            });
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                models.Course.destroy({where: {name:"test creat name course"}});
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Post /admin/courses/updateCourse', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).post('/admin/courses/updateCourse');
            req.cookies = Cookies;
            req.send({
                id: 1,
                name: 'test update name course',
                // description: 'test update name description',
                // duration: 'test update duration',
                // test: 'test update test',
                // documents: 'test update documents',
                // isDeleted:  0,
                // courseTypeId: {id:1},
                // trainingProgramId:{id:1},
            });
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                models.Course.update({
                    name: 'Training Overview',
                } ,{
                    where: {
                        id: 1
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Post /admin/courses/deleteCourse', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).post('/admin/courses/deleteCourse');
            req.cookies = Cookies;
            req.send({
                id: 1,
            });
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                models.Course.create({
                    id: 1,
                    name: 'Training Overview',
                    description: 'Brief overview for all training courses',
                    duration: '',
                    test: '',
                    documents: '',
                    courseTypeId: 0,
                    trainingProgramId: 1,
                    imgLink: '/img/courses/training-icon-2.svg',
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 4 : Get Course List', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/admin/courses/getCourseList');
            req.cookies = Cookies;
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 5 : get Course Type List', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/admin/courses/getCourseTypeList');
            req.cookies = Cookies;
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6 : get Training Program List', function() {
        return it('Should return success==true', function(done) {
            var req = request(DCC_Server).get('/admin/courses/getTrainingProgramList');
            req.cookies = Cookies;
            req.end(function(err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

});
