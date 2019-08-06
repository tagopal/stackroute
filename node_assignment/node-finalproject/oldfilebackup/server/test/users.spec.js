const should = require('chai').should();
const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const modules = require("../modules")

before((done) => {
  modules.initializeMongooseConnection()
    .then(() => {
      done();
    });
});

// clear users collection
before((done) => {
  modules.userModel.remove({}, (err) => {
    if(err) return done(err);
    done();
  });
});

const findUser = (query, done) => {
   modules.userModel.findOne(query, (err, note)=> {
    if(err) {
      done(err);
    } else {
      done(null, note);
    }
  });
}
//  testsuite
describe('Testing to register a user', function()
{
  //  testcase
  it('Should handle a request to register a user', function(done)
  {
    request(app)
      .post('/api/v1/users/register')
      .send(config.users.user1)
      .expect(201)
      .end((err, res) => {
      should.not.exist(err);
      should.exist(res.body, 'Response body should not be null or undefined');
      res.body.newUser.should.be.equal('gopal', 'Response body should have a key as userInfo which will hold username value');
      findUser({username: res.body.newUser}, (error, user)=> {
        if(err) {
          should.not.exist(error);
          done();
        } else {
          should.exist(user, 'Returning null as a response, should return registered user');
          user.username.should.be.equal('gopal');
          done();
        }
    });
  });
});

  //  testcase
  it('Should handle a request to register a user multiple times with same username', function(done)
  {
    request(app)
        .post('/api/v1/users/register')
        .send(config.users.user1)
        .expect(200)
        .end((error, response) => {
          if(error) return done(error);
          should.equal(response.body.message, 'username is already exist', 'response should have proper error message');
          done();
        });
});
  });


//  testsuite
describe('Testing to login user', function()
{
  //  testcase
  it('Should handle a request to successfully login', function(done)
  {
    //Response body should have a key as user which will hold userName as a key and it will hold username value
    // status code = 200
    // response body will hold user.userName
    request(app)
    .post('/api/v1/users/login')
    .send(config.users.user1)
    .expect(200)
    .end((error, response) => {
      if(error) return done(error);
      should.equal(response.body.user.username, config.users.user1.username, 'response should return proper userInfo');
       done();
    });
  });


  it('Should handle a request to login with wrong password', function(done)
  {
    request(app)
     .post('/api/v1/users/login')
     .send(config.users.user1WithWrongPassword)
     .expect(403)
     .end((error, response) => {
       if(error) return done(error);
       should.equal(response.body.message, 'Passwords is incorrect', 'response should return proper error message');
        done();
     });
  });

  //  testcase
  it('Should handle a request to login with wrong username', function(done)
  {
    //Response body should have a key as message which will hold value as 'You are not registered user'
    // status code = 403
    // response body will hold an object with message key
    request(app)
    .post('/api/v1/users/login')
    .send(config.users.user2)
    .expect(403)
    .end((error, response) => {
      if(error) return done(error);
      should.equal(response.body.message, 'You are not registered user', 'response should return proper error message');
      done();
    });
  });
});
