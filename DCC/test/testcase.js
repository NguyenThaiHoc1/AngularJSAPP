var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
var route = require('../app.js');
var models = require('../server/models');



var globalCookies;

models.course.sync({
    force: false
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

describe('<Unit Test for Routing>', function() {
    describe('', function() {
        return it('Test case 1 : get / ', function(done) {
            request(route)
                .get('/')
                .expect(200, done)
        });
    });

    describe('', function() {
        return it('Test case 2 : get /course ', function(done) {
            request(route)
                .get('/course')
                .expect(200, done)
        });
    });

    describe('', function() {
        return it('Test case 3 : get /course/coursedetail ', function(done) {
            request(route)
                .get('/course/coursedetail')
                .expect(200, done)
        });
    });
    describe('', function() {
        return it('Test case 4 : get /course/coursedetail/:id ', function(done) {
            request(route)
                .get('/course/coursedetail/1')
                .expect(200, done)
        });
    });
    describe('', function() {
        return it('Test case 5 : get /course/trainerdashboard ', function(done) {
            request(route)
                .get('/course/trainerdashboard')
                .expect(200,done)
        });
    });
    describe('', function() {
        return it('Test case 6 : get /users/userprofile When user not logged in ', function(done) {
            request(route)
                .get('/users/userprofile')
                .expect(200,done)
        });
    });

    describe('', function() {
        return it('Test case 7 : get /getEvents ', function(done) {
            request(route)
                .get('/getEvents')
                .expect(200, done)
        });
    });

    describe('', function() {
        return it('Test case 8 : get /users/trainingprogram ', function(done) {
            request(route)
                .get('/users/trainingprogram')
                .expect(200, done)
        });
    });

});

//---------------------------------------------------------------------------------------

describe('<Unit test for Login>', function() {
    describe('', function() {
        var Cookies;
        beforeEach(function(done) {
            request(route)
                .post('/users/login')
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
        return it('Test case 0 : Check authenticated: Logged in', function(done) {
            var req = request(route).get('/isLogged');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .end(function(err, res) {
                    assert.equal(res.text, 'qwe@gmail.com');
                    if(err)
                      return done(err);
                    done();
                });
        });
    });
    describe('', function() {
        var Cookies;
        return it('Test case 0.1 : Check authenticated: Not Logged in', function(done) {
            var req = request(route).get('/isLogged');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .end(function(err, res) {
                    assert.equal(res.text, '');
                    if(err)
                      return done(err);
                    done();
                });
        });
    });
    describe('', function() {
        return it('Test case 1 : Login success', function(done) {
            request(route)
                .post('/users/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'qwe'
                })
                .end(function(err, res) {
                    assert.equal(res.body.userid, 'qwe@gmail.com');
                    globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if(err)
                      return done(err);
                    done();
                });
        });
    });

    describe('', function() {
        return it('Test case 2 : Login fail, username true, password false', function(done) {
            request(route)
                .post('/users/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'thach13'
                })
                .end(function(err, res) {
                    assert.equal(res.body.userid,null); // edit for HEY's testing
                    if(err)
                      return done(err);
                    done();
                });
          });
      });
        describe('', function() {
            return it('Test case 3 : Login fail, username false, password true', function(done) {
                request(route)
                    .post('/users/login')
                    .send({
                        username: 'thach1',
                        password: 'qwe'
                    })
                    .end(function(err, res) {
                        assert.equal(res.body.userid, null);
                        if(err)
                          return done(err);
                        done();
                    });
            });
        });

        describe('', function() {
            return it('Test case 4 : Login fail, username null, password true', function(done) {
                request(route)
                    .post('/users/login')
                    .send({
                        username: null,
                        password: 'qwe'
                    })
                    .end(function(err, res) {
                        assert.equal(res.body.userid, null);
                        if(err)
                          return done(err);
                        done();
                    });
            });
        });

        describe('', function() {
            return it('Test case 5 : Login fail, username true, password null', function(done) {
                request(route)
                    .post('/users/login')
                    .send({
                        username: 'qwe@gmail.com',
                        password: null
                    })
                    .end(function(err, res) {
                        assert.equal(res.body.userid, null);
                        if(err)
                          return done(err);
                        done();
                    });
            });
        });

        describe('', function() {
            return it('Test case 6 : Login fail, username false, password null', function(done) {
                request(route)
                    .post('/users/login')
                    .send({
                        username: 'thach2',
                        password: null
                    })
                    .end(function(err, res) {
                        assert.equal(res.body.userid, null);
                        if(err)
                          return done(err);
                        done();
                    });
            });
        });

        describe('', function() {
            return it('Test case 7 : Login fail, username null, password false', function(done) {
                request(route)
                    .post('/users/login')
                    .send({
                        username: null,
                        password: '123'
                    })
                    .end(function(err, res) {
                        assert.equal(res.body.userid, null);
                        if(err)
                          return done(err);
                        done();
                    });
            });
        });
});

describe('<Logout Function>', function() {
    return it('Test for get /users/logout ', function(done) {
        var req = request(route).get('/users/logout');
        req.cookies = null;
        req
        .set('Accept','application/json')
        .end(function(err, res) {
            assert.equal(res.status, '302');
            if(err)
              return done(err);
            done();
        });
    });
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// describe('<Unit test for Course controller', function() {
//     describe('', function() {
//         return it('Test case 1 : POST /course/getCourse', function(done) {
//             request(route)
//                 .post('/course/getCourse')
//                 .send({
//                     courseID: '1'
//                 })
//                 .end(function(err, res) {
//                     assert.equal(res.body.courseName, 'CBA Overview');
//                     return done();
//                 });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 2 : POST /course/addCourse duplicate name', function(done) {
//             var datasend = {
//                 courseName: 'CBA Overview',
//                 courseDescription: 'This is testing Des',
//                 courseCategory: 'testing cat',
//                 courseTest: 'testing test',
//                 courseDocuments: 'testing doc'
//                 // courseTrainerID: [{
//                 //     "text": "testing"
//                 // }]
//             };
//             request(route)
//                 .post('/course/addCourse')
//                 .send(datasend)
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'Name already existed. Add fail!');
//                     return done();
//                 });
//         });
//     });
//     describe('', function() {
//         return it('Test case 3 : POST /course/addCourse success', function(done) {
//             var datasend = {
//                 courseName: 'Testing123',
//                 courseDescription: 'This is testing Des',
//                 courseCategory: 'testing cat',
//                 courseTest: 'testing test',
//                 courseDocuments: 'testing doc'
//                 // courseTrainerID: [{
//                 //     "text": "testing"
//                 // }]
//             };
//             request(route)
//                 .post('/course/addCourse')
//                 .send(datasend)
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'Add course success!');
//                     return done();
//                 });
//             afterEach(function() {
//                 models.course.destroy({
//                     where: {
//                         name: 'Testing123'
//                     }
//                 });
//             });
//         });
//     });
//     describe('', function() {
//         return it('Test case 4 : POST /course/updateCourse success', function(done) {
//             var datasend = {
//                 courseIDEdit: 999,
//                 courseNameEdit: 'testing3',
//                 courseDescriptionEdit: 'This is testing Des3',
//                 courseCategoryEdit: 'testing cat3',
//                 courseTestEdit: 'testing testing3',
//                 courseDocumentsEdit: 'testing doc3'
//                 // courseTrainerIDEdit: [{
//                 //     "text": "testing3"
//                 // }]
//             };
//             request(route)
//                 .post('/course/updateCourse')
//                 .send(datasend)
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'Edit course success!');
//                     return done();
//                 });
//         });
//     });
//     describe('', function() {
//         return it('Test case 5 : POST /course/updateCourse : Course not found', function(done) {
//             var datasend = {
//                 courseIDEdit: 992,
//                 courseNameEdit: 'testing3',
//                 courseDescriptionEdit: 'This is testing Des3',
//                 courseCategoryEdit: 'testing cat3',
//                 courseTestEdit: 'testing testing3',
//                 courseDocumentsEdit: 'testing doc3'
//                 // courseTrainerIDEdit: [{
//                 //     "text": "testing3"
//                 // }]
//             };
//             request(route)
//                 .post('/course/updateCourse')
//                 .send(datasend)
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'Course not found in database');
//                     return done();
//                 });
//         });
//     });
//     describe('', function() {
//         return it('Test case 6 : POST /course/list return courselist', function(done) {
//             request(route)
//                 .get('/course/list')
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'send list success');
//                     return done();
//                 });
//         });
//     });
//     describe('', function() {
//         return it('Test case 7 : POST /course/isDeletedCourse delete success', function(done) {
//             request(route)
//                 .post('/course/isDeletedCourse')
//                 .send({
//                     courseIDDelete: 999
//                 })
//                 .end(function(err, res) {
//                     assert.equal(res.body.msg, 'Delete success');
//                     return done();
//                 });
//         });
//     });
//     describe('', function() {
//         return it('Test case 8 : POST /course/isDeletedCourse delete course already deleted', function(done) {
//             request(route)
//                 .post('/course/isDeletedCourse')
//                 .send({
//                     courseIDDelete: 999
//                 })
//                 .end(function(err, res) {
//                     models.course.update({
//                         isDeleted: false
//                     }, {
//                         where: {
//                             id: 999
//                         }
//                     });
//                     assert.equal(res.body.msg, 'Delete failure');
//                     return done();
//                 });
//         });
//     });
// });


describe('<Unit test for Course model', function() {
    // describe('Method Course', function() {
    //     return it('Test case 1: getByID with id existed in database - return course object', function(done) {
    //         models.course.getByID('1', function(course) {
    //             assert.equal(course.id, 1);
    //             return done();
    //         })
    //     });
    // });
    describe('', function() {
        return it('Test case 2: getByID with id not found in database - return null', function(done) {
            models.course.getByID('not found', function(course) {
                assert.equal(course, null);
                return done();
            })
        });
    });
    // describe('', function() {
    //     return it('Test case 3: getByName with name existed in database - return course course object', function(done) {
    //         models.course.getByName('CBA Overview', function(course) {
    //             assert.equal(course.name, 'CBA Overview');
    //             return done();
    //         })
    //     });
    // });
    describe('', function() {
        return it('Test case 4: getByName with name not found in database - return course = null', function(done) {
            models.course.getByName('not found', function(course) {
                assert.equal(course, null);
                return done();
            })
        });
    });
    // describe('', function() {
    //     return it('Test case 5: getByCategory with category existed in database - return course[] list object ', function(done) {
    //         models.course.getByCategory('CBA Overview', function(course) {
    //             assert.equal(course[0].category, 'CBA Overview');
    //             assert.equal(course[2].category, 'CBA Overview');
    //             return done();
    //         })
    //     });
    // });
    describe('', function() {
        return it('Test case 6: getByCategory with category not found in database - return course[] null ', function(done) {
            models.course.getByCategory('not found', function(course) {
                assert.equal(course[0], null);
                return done();
            })
        });
    });
    // describe('', function() {
    //     return it('Test case 7: getByTrainerID with trainerID existed in database - return course[] list object', function(done) {
    //         models.course.getByTrainerID('King Nguyen', function(course) {
    //             assert.equal(course[0].trainerID, 'King Nguyen');
    //             return done();
    //         })
    //     });
    // });
    // describe('', function() {
    //     return it('Test case 8: getByTrainerID with TrainerID not found in database - return course[] null', function(done) {
    //         models.course.getByTrainerID('not found', function(course) {
    //             assert.equal(course[0], null);
    //             return done();
    //         })
    //     });
    // });
    // describe('', function() {
    //     return it('Test case 9: getCourses in database - return course[] list object', function(done) {
    //         models.course.getCourses(function(course) {
    //             assert.equal(course[0].id, '1');
    //             return done();
    //         })
    //     });
    // });
});

describe('<Unit test for User model>', function() {
    describe('Method User', function() {
        return it('Test case 1: getUserByID', function(done) {
            models.User.getUserByID('1', function(user) {
                assert.equal(user.username, 'trainee2');
                return done();
            })
        });
    });

    describe('', function() {
        return it('Test case 2: getUserByName', function(done) {
            models.User.getUserByName('qwe@gmail.com', function(user) {
                assert.equal(user.id, '8');
                return done();
            })
        });
    });
});

describe('<Unit test for userProfile function>', function() {
    describe('Send data to font-end', function() {
        return it('Get /users/userprofileController ', function(done) {
            var req = request(route).get('/users/userprofileController');
            req.cookies = globalCookies;
            req
            .set('Accept','application/json')
            .end(function(err, res) {
                assert.equal(res.body.pName, 'qwe@gmail.com');
                assert.equal(res.body.pEmail, 'qwe@gmail.com');
                if(err)
                  return done(err);
                done();
            });
        });
    });

    describe('Route for editUserProfile page', function() {
        return it('Get /users/edituserprofile ', function(done) {
            request(route)
                .get('/users/edituserprofile')
                .expect(200, done)
        });
    });

    describe('Edit data method', function() {
        return it('Post /users/userprofileReturnValue ', function(done) {
            var req = request(route).post('/users/userprofileReturnValue');
            req.cookies = globalCookies;
            req
            .set('Accept','application/json')
            .send({
                status: 'vhlam',
                dob: '20/10/1995'
            })
            .end(function(err, res) {
                assert.equal(res.body.msg, 'Success');
                if(err)
                  return done(err);
                done();
            });
        });
    });

    describe('Upload avatar method', function() {
        return it('Post /users/photo ', function(done) {
            var req = request(route).post('/users/photo');
            req.cookies = globalCookies;
            req
            .set('Accept','application/json')
            .field('filename', 'test file')
        		.attach('userPhoto', 'test/test.jpg')
            .end(function(err, res) {
                assert.equal(res.status, '200');
                if(err)
                  return done(err);
                done();
            });
        });
    });
});

describe('<Unit test for feedback function>', function() {

  describe('', function() {
    return it('Test case 1 : Create a comment for course that doesnt have comment ', function(done) {
      var req = request(route).post('/feedback/comment');
      req.cookies = globalCookies;
      req
      // .set('Accept','application/json')
      .send({
        courseId: 9999,
        comment: 'feedback'
        })
      .end(function(err, res) {
        assert.equal(res.body.msg,'create successfully');
        if(err)
          return done(err);
        done();
      });
      });
  });

    describe('', function() {
      return it('Test case 2 : Update comment for course having comment already', function(done) {
        var req = request(route).post('/feedback/comment');
        req.cookies = globalCookies;
        req
        .send({
            courseId: 9999,
            comment: 'update feedback'
        })
        .end(function(err,res){
          assert.equal(res.body.msg,'update successfully');
          if(err)
            return done(err);
          done();
        })
      });
    });

    describe('', function() {
        return it('Test case 3 : show feedback', function(done) {
          var req = request(route).post('/feedback/showFeedback');
          req.cookies = globalCookies;
          req
          .send({
              courseId: 9999,
          })
          .end(function(err,res) {
            assert.equal(res.body[0].comment, 'update feedback');
            if(err)
              return done(err);
            done();
          });
          afterEach(function() {
              models.Feedback.destroy({
                  where: {
                      courseID: 9999
                    }
              });
          });
        });
    });

    describe('', function() {
      return it('Test case 4 : Create a rating for course that doesnt have rating', function(done) {
          var req = request(route).post('/feedback/rating');
          req.cookies = globalCookies;
          req
          .send({
            courseId: 9998,
            rating: 3
          })
          .end(function(err,res){
            assert.equal(res.body.msg,'create successfully');
            if(err)
              return done(err);
            done();
          });
        });
    });

    describe('', function() {
      return it('Test case 5 : Update rating for course having rating already', function(done) {
          var req = request(route).post('/feedback/rating');
          req.cookies = globalCookies;
          req
          .send({
            courseId: 9998,
            rating: 4
          })
          .end(function(err,res){
            assert.equal(res.body.msg,'update successfully');
            if(err)
              return done(err);
            done();
          });
        });
    });

    describe('', function() {
      return it('Test case 6 : show average rating', function(done) {
          var req = request(route).post('/feedback/showAverageRating');
          req.cookies = globalCookies;
          req
          .send({
            courseId: 9998,
          })
          .end(function(err,res){
            assert.equal(res.body.result, 4);
            if(err)
              return done(err);
            done();
          });
        });
    });
    models.Feedback.destroy({
        where: {
            courseID: 9998
          }
    });
  });

//-----------------------------------------------------------------------
