// const should = require('chai').should();
// const request = require('supertest');
// const app = require('../app');
// const config = require('./test.config');
// const notesModel = require('../api/v1/notes/notes.entity');
// const userModel = require('../api/v1/users/users.entity');

// describe('Stream test scenarios', function() {
// 	before(function(done) { done(); });
// 	after(function(done) { done(); });

// 	it('Get stream must return stream data', function(done) {
//         request(app)
//         .get('/api/v1/notes/stream')
//         .end(function(err, res) {
//             if(res){
//                 done();
//             }
//         })
//     });
    
//     it('Add stream must send data and return 201 response', function(done) {
//         request(app)
//         .post('/api/v1/notes/stream')
//         .send('hi')
//         .end(function(err, res) {
//             if(res){
//                 done();
//             }
//         })
//     });
    
//     it('Add stream with empty data must return 403 response', function(done) {
//         request(app)
//         .post('/api/v1/notes/stream')
//         .send({message:""})
//         .expect(403)
//         .end((error, response) => {
//             if(error) return done(error);
//             done();
//         });
//     });

//     it('Add stream with invalid data must return 403 response', function(done) {
//         request(app)
//         .post('/api/v1/notes/stream')
//         .send({message:"hi"})
//         .expect(403)
//         .end((error, response) => {
//             if(error) return done(error);
//             done();
//         });
//     });

//     it('Share stream must share the data and return Completed the request as response', function(done) {
//         request(app)
//         .post('/api/v1/notes/share')
//         .send('share')
//         .end(function(err, res) {
//             should.exist(res.body, 'Completed the request');
//             done();
//         })
//     });
    
//     it('Share stream with invalid data and return 403 as response', function(done) {
//         request(app)
//         .post('/api/v1/notes/share')
//         .send({message:"hi"})
//         .expect(403)
//         .end((error, response) => {
//             if(error) return done(error);
//             done();
//         });
// 	});
// });