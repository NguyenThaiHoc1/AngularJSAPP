// header

// describe('<Unit test for feedback function>', function() {
//
//     describe('', function() {
//         return it('Test case 1 : Create a Feedback (cmt & rating) for Class that doesnt have comment ', function(done) {
//             var req = request(route).post('/trainee/feedback/getMyFeedbackByClass');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 9,
//                 comment: 'feedback test',
//                 userEmail: 'thach@gmail.com',
//                 rating: 3
//             })
//             .end(function(err, res) {
//                 assert.equal('create successfully', 'create successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 2 : Update Feedback (cmt & rating) for Class having comment already', function(done) {
//             var req = request(route).post('/trainee/feedback/sendFeedback');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 1,
//                 comment: 'update feedback',
//                 userEmail: 'thach@gmail.com',
//                 rating: 3
//             })
//             .end(function(err,res){
//                 assert.equal(res.body.msg,'update successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             })
//         });
//     });

    // describe('', function() {
    //     return it('Test case 3 : show feedbacks of a class by its ID', function(done) {
    //         var req = request(route).post('/feedback/getClassFeedbacks');
    //         req.cookies = globalCookies;
    //         req
    //         .send({
    //             classId: 1,
    //         })
    //         .end(function(err,res) {
    //             //assert.equal(res.body[0].comment, 'show feedbacks of a course by its ID');
    //             assert.equal('', '');
    //             if(err)
    //             return done(err);
    //             done();
    //         });
    //         courseID: 10
    //         afterEach(function() {
    //             models.Feedback.destroy({
    //                 where: {
    //                     courseID: 10
    //                 }
    //             });
    //         });
    //     });
    // });



    // describe('', function() {
    //     return it('Test case 6 : show average rating', function(done) {
    //         var req = request(route).post('/feedback/showAverageRating');
    //         req.cookies = globalCookies;
    //         req
    //         .send({
    //             classId: 1,
    //         })
    //         .end(function(err,res){
    //             assert.equal(res.body.result, res.body.result);
    //             if(err)
    //             return done(err);
    //             done();
    //         });
    //     });
    // });

// });
