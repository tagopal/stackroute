const should = require('chai').should();
const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const notesModel = require('../api/notes/notes.entity');
const userModel = require('../api/users/users.entity');


let noteID = 1;
const modules = require("../modules");
const baseNotesApi = '/api/v1/notes/?userId='


const findNote = (query, done) => {
  modules.noteModel.findOne(query, (err, note)=> {
    if(err) {
      done(err);
    } else {
      done(null, note);
    }
  });
}
user1 = config.users.user1;
user2 = config.users.user2;
user3 = config.users.user3;

before((done)=>{
  modules.initializeMongooseConnection().then(()=>{done();});
});
before((done) => {
  userModel.remove({}, (err) => {
    if(err) return done(err);
    done();
  });
});

before((done) => {
  notesModel.remove({}, (err) => {
    if(err) return done(err);
    done();
  });
});

function loginUser()
{
  return function(done)
  {
    this.timeout(4000);
    request(app)
    .post('/api/v1/users/register')
    .send(user1)
    .end(function(err, res) {
      request(app)
      .post('/api/v1/users/register')
      .send(user2)
        .end(function(err, res) {
          request(app)
            .post('/api/v1/users/register')
            .send(user3)
            .end(function(err, res) {
               request(app)
                .post('/api/v1/users/login')
                .expect(200)
                .send(user1)
                .end((err, res) => {
                  should.not.exist(err);
                  json_res = JSON.parse(res.text)
                  USER_ID_1 = json_res.user.username;
                  jwtToken1  = json_res.token;
                  request(app)
                  .post('/api/v1/users/login')
                  .expect(200)
                  .send(user2)
                  .end((err, res) => {
                    json_res = JSON.parse(res.text)
                    USER_ID_2 = json_res.user.username
                    should.not.exist(err);
                    jwtToken2  =json_res.token;
                    request(app)
                      .post('/api/v1/users/login')
                      .expect(200)
                      .send(user3)
                      .end((err, res) => {
                        json_res = JSON.parse(res.text)
                        USER_ID_3 = json_res.user.username
                        should.not.exist(err);
                        jwtToken3  =json_res.token;
                        done();
              });
              });
            });
        });});
      });
  };
};
before(loginUser());
//  testsuite
describe('Testing to add a note', function()
{
  //  testcase
  it('Should handle a request to add a new note for user 1 ', function(done)
  {
    this.timeout(3000);
    const note = config.mockNotes.noteOne;
    request(app)
      .post(`${baseNotesApi}${USER_ID_1}`)
      .set('Authorization', 'Bearer ' + jwtToken1)
      .expect(201)
      .expect('Content-Type',  /json/)
      .send(config.mockNotes.noteOne)
      .end((error, response) => {
        should.not.exist(error);
        should.exist(response.body, 'Should return inserted note');
        response.body.text.should.be.equal(config.mockNotes.noteOne.text, 'Should match added note text value');
        noteId = response.body.id;
        findNote({userId: USER_ID_1, id: noteId}, (error, note)=> {
          if(error) {
            should.not.exist(error);
            done();
          } else {
            should.exist(note, 'Returning null as a response, should return inserted note');
            note.text.should.be.equal(config.mockNotes.noteOne.text);
            done();
          }
        });
  });
});

  //  testcase
  it('Should handle a request to add a new note for user 2', function(done)
  {
    // Should get added note of user 2 as a respone,  need to match added note text value
    // status = 201
    // response will be added note object
    const note = config.mockNotes.noteTwo;
     request(app)
      .post(`${baseNotesApi}${USER_ID_2}`)
      .set('Authorization', 'Bearer ' + jwtToken2)
      .expect(201)
      .expect('Content-Type',  /json/)
      .send(config.mockNotes.noteTwo)
      .end((error, response) => {
        should.not.exist(error);
        should.exist(response.text, 'Should return inserted note');
        json_val = JSON.parse(response.text)
        json_val.text.should.be.equal(config.mockNotes.noteTwo.text, 'Should match added note text value');
        noteId = response.body.id;
        findNote({userId: USER_ID_2, id: noteId}, (error, note)=> {
          if(error) {
            should.not.exist(error);
            done();
          } else {
            should.exist(note, 'Returning null as a response, should return inserted note');
            note.text.should.be.equal(config.mockNotes.noteTwo.text);
            done();
          }
        });
  });
});
});
//  testsuite
describe('Testing to get all notes', function()
{
  //  testcase
  it('Should handle a request to get all notes of a user 1', function(done)
  {
    // Should get all note as a array those are created by user 1 and Should match recently added note text value
    // status = 200
    // response will be a array or all notes those are added by user 1
    const note = config.mockNotes.noteOne;
    request(app)
      .get(`${baseNotesApi}${USER_ID_1}`)
      .set('Authorization', 'Bearer ' + jwtToken1)
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const notes = response.body;
        should.equal(notes[notes.length-1].text, note.text,'Response should return list of notes');
        done();
      });
  });

  //  testcase
  it('Should handle a request to get all notes of a user 2', function(done)
  {
    // Should get all note as a array those are created by user 2 and Should match recently added note text value
    // status = 200
    // response will be a array or all notes those are added by user 2
    const note = config.mockNotes.noteTwo;
    request(app)
      .get(`${baseNotesApi}${USER_ID_2}`)
      .set('Authorization', 'Bearer ' + jwtToken2)
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const notes = response.body;
        should.equal(notes[notes.length-1].text, note.text,'Response should return list of notes');
        done();
      });
  });

  //  testcase
  it('Should handle a request to get notes of a user who has not created any note', function(done)
  {
    // should get blank array
    // status = 200
    // response will be an empty array
    request(app)
      .get(`${baseNotesApi}${USER_ID_3}`)
      .set('Authorization', 'Bearer ' + jwtToken3)
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const notes = response.body;
        should.equal(notes.length, 0,'Response should return an empty list of notes');
        done();
      });
    });
});

//  testsuite
describe('Testing to update a note', function()
{
  //  testcase
  it('Should handle a request to update a note by note id', function(done)
  {
    // Should return updated note and match updated note text value'
    // status = 200
    // response will hold updated note as an object
    let note = config.mockNotes.noteOne;
    note.text = "Updated Text";
    note.id = noteID;
    request(app)
        .put(`/api/v1/notes/${noteID}`)
        .set('Authorization', 'Bearer ' + jwtToken1)
        .expect(200)
        .send(note)
        .end((error, response) => {
          if(error) return done(error);
          let parsed_response = JSON.parse(response.text)
          should.equal(parsed_response.text, note.text, 'Response should contain updated note');
          done();
        });
  });
});
