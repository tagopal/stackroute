const should = require('chai').should();
const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const notesModel = require('../api/v1/notes/notes.entity');
const userModel = require('../api/v1/users/users.entity');


describe('Stream test scenarios', function() {
	before(function(done) { done(); });
    after(function(done) { done(); });
    
    it('Share stream must share the data and return Completed the request as response', function(done) {
        request(app)
        .post('/api/v1/notes/share')
        .send('share')
        .expect(200)
        .end(function(err, res) {
            should.exist(res.body, 'Completed the request');
            done();
        })
    });
    
    it('Share stream with valid data and return 201 as response', function(done) {
        request(app)
        .post('/api/v1/notes/share')
        .send({message:"hi"})
        .expect(201)
        .end((error, response) => {
            if(error) return done(error);
            done();
        });
    });
});