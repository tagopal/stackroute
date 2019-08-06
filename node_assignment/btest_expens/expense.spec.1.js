const expect = require('chai').expect;
const request =  require('supertest');
const app = require('../index');

const baseRoute = '/api/expense';

const testData = {
  validExpense:{
    "id": "9",
    "title": "test",
    "category": "test",
    "description": "test data",
    "amount": "5000",
    "expenseDate":"18/11/2017"
  },
  existingExpense:{
    "id": "1",
    "title": "test",
    "category": "test",
    "description": "test data",
    "amount": "5000",
    "expenseDate":"18/11/2017"
  },
  emptyExpense: {},
  missingTitleExpense:{
    "id": "9",
    "category": "test",
    "description": "test data",
    "amount": "5000",
    "expenseDate":"18/11/2017"
  },
  missingIdExpense:{
    "title": "test",
    "category": "test",
    "description": "test data",
    "amount": "5000",
    "expenseDate":"18/11/2017"
  },
  expenseWithOnlyId:{
    "id": '1'
  }
}

// testsuit starts from here
describe('Expense Manager testing', function() {

  //testsuit for functionality testing
  describe('Functionality testing', function() {
    // testsuit for adding expense
    describe('Adding expense functionality testing', function() {
      // testcase to insert expense record
      it('Should create expense, returning success message', function(done) {
          //write assertion code here and your response should return below given message
          //'Expense record is added successfully'
          request(app)
            .post(`${baseRoute}`)
            .send(testData.validExpense)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.equal('Expense record is added successfully');
            });
          done();
      });
      // testcase to handle, if expense record is already exist with the given id
      it('Should not create expense if expense is already exist with the given id, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          //'Expense record is already exist with the given id'
          request(app)
            .post('${baseRoute}/')
            .send(testData.existingExpense)
            .expect(409)
            .end((err,res)=> {
              if(err) return done(err);
              expect(res.body).to.equal('Expense record is already exist with the given id');
            });
          done();
      });
      // testcase to handle, if user is passing empty record.
      it('Should not create expense if passing empty record, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          //'Empty data is not allowed, please provide some valid data to insert record'
          request(app)
            .post('${baseRoute}/')
            .send(testData.emptyExpense)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body, responseMessages.emptyDataReceived,'Empty Data is not allowed, Please provide valid data')
            });
          done();
      });
      // testcase to handle, if user is not passing any record in post body.
      it('Should not create expense if user is not passing any record in post request, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Please provide some data to add new expense'
          request(app)
            .post('${baseRoute}/')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body, responseMessages.noDataReceived,'Please provide data to add new expense')
            });
          done();
      });
      // testcase to handle, if user is passing wrong key as a record.
      it('Should not create expense if user is passing wrong data, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Please provide values for id ,title, category, description, amount and expenseDate. All are mandatory data elements'
          request(app)
            .post('${baseRoute}/')
            .send(testData.missingTitleExpense)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body, responseMessages.missingTitleInData,'Should not add create wrong id')
            });
          done();
      });
    });
    // testsuit to get all expense record
    describe('Getting all expense functionality testing', function() {
      it('Should get all expense, returning array of expense ', function(done) {
          // write assertion code here and check response array length, it should be greater than zero
          request(app)
            .post('${baseRoute}/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.isNotEmpty(res.body);
                assert.isAbove(res.body.length,0);
            });
          done();
      });
    });
    // testsuit to update expense record
    describe('Updating expense functionality testing', function() {
      // testcase to update particular expense category
      it('Should search expense by id and update expense category, returning success message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Expense record is updated successfully'
          request(app)
          .put('${baseRoute}/${testData.existingExpense.id}')
          .send(testData.existingExpense)
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.body, responseMessages.expenseNotFoundWithId,'Expense record is not found with the given Id')
          });
          done();
      });
      // testcase to handle, if no expense record will be found by given category
      it('Should search expense by id if expense is not found with the given id, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Expense record is not found with the given id'
          request(app)
          .put('${baseRoute}/-1')
          .send(testData.existingExpense)
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.body, responseMessages.expenseNotFoundWithId,'Expense record is not found with the given Id')
          });
          done();
      });
      // testcase to handle, if user is passing empty record.
      it('Should not update expense if passing empty record, returning error message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Empty data is not allowed, please provide some valid data to update record'
        request(app)
          .put('${baseRoute}/1')
          .send(testData.emptyExpense)
          .expect(400)
          .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.body, responseMessages.emptyDataForUpdate,'Expense record is updated sucessfully')
          });
         done();
      });
      // testcase to handle, if user is not passing any record in put body.
      it('Should not update expense if user is not passing any record in update request, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Please provide id and some data to update expense record'
          done();
      });
      // testcase to handle, if user is not passing id in update request.
      it('Should not update expense if passing without any id, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Please provide expense id to update record'
          done();
      });
      // testcase to handle, if user is passing id only id not other field values.
      it('Should not update expense if passing only id not other fields, returning error message', function(done) {
          // write assertion code here and your response should return below given message
          // 'Please provide values those needs to update'
          done();
      });
    });
    // testsuit to search and get expense record according to given condition
    describe('Searching expense functionality testing', function() {
      // testcase to get all expense those are matching with given start and end date
      it('Should search expense by start and end date, returning matching expense data as an array', function(done) {
        // write assertion code here and check response array length, it should be greater than zero
        done();
      });
       // testcase to get all expense, those are equal to given start date and greater than given start date
      it('Should search expense by start date only, returning expense data where date is greater than and equal to the given start date', function(done) {
        // write assertion code here and check response array length, it should be greater than zero
        done();
      });
      // testcase to get all expense those are matching with given category, start and end date.
      it('Should search expense by category, start and end date, returning matching expense data as an array', function(done) {
        // write assertion code here and check response array length, it should be greater than zero
        done();
      });
      // // testcase to get all expense, those are equal to given category, start date and greater than given start date
      it('Should search expense by category and start date only, returning expense data matching with given category and date should be greater than and equal to start date', function(done) {
        // write assertion code here and check response array length, it should be greater than zero
        done();
      });
      // // testcase to get all expense, those are equal to given category, start date and greater than given start date
      it('Should handle 404 error if route not matched, returning Not Found message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Not Found'
        done();
      });
    });
    // testsuit to delete a expense record
    describe('Deleting expense functionality testing', function() {
      // testcase to delete expense record by given id
      it('Should search expense by id and delete particular expense record, returning success message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Expense record is deleted successfully'
        done();
      });
      // testcase to handle, if no expense record will be found by given id
      it('Should search expense by id if expense is not found with the given id, returning error message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Expense provide correct id, there is no expense record with the given id'
        done();
      });
      // testcase to handle, if user is not passing any record in delete body.
      it('Should not delete expense if user is not passing any record in delete request, returning error message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Please provide expense id to delete expense record'
        done();
      });
      // testcase to handle, if user is not passing id in delete request body.
      it('Should not delete expense if not passing id, returning error message', function(done) {
        // write assertion code here and your response should return below given message
        // 'Please provide expense id to delete expense record'
        done();
      });
    });
  });
});