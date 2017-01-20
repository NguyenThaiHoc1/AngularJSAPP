
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


// });
