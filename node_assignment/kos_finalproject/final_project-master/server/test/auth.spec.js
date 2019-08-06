const expect = require('chai').expect;
const { signJWTToken, verifyJWTToken } = require('../modules');
const authConfig = require('../config/appConfig');
const config = require('./test.config');
let testToken = '';
let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
let secret= "secret"

describe('JWT Token test scenarios', function() {
	before(function(done) { done(); });
	after(function(done) { done(); });

	it('Assert signing & verification methods exists and are valid', function() {
		expect(signJWTToken).to.not.equal(undefined);
		expect(signJWTToken).to.not.equal(null);
		expect(typeof(signJWTToken)).to.equal('function');
		expect(signJWTToken.length).to.be.above(0, 'this method must have arguments');

		expect(verifyJWTToken).to.not.equal(undefined);
		expect(verifyJWTToken).to.not.equal(null);
		expect(typeof(verifyJWTToken)).to.equal('function');
		expect(verifyJWTToken.length).to.be.above(0, 'this method must have arguments');

		expect(signJWTToken).to.be.an('function');
	});

	it('sign a token with valid payload, signature, secret and expiry time', function(done) {
		signJWTToken(config.payload1, secret, '10h', (err, token) => {
			if (err) return done(err);
			testToken = token;
			expect(token).to.not.equal(null);
			expect(token.length).to.be.above(0);
			done();
		});
	});
	it('verification of a valid signed token, must return same payload, which was passed', function(done) {
		verifyJWTToken(testToken, secret, (err, decoded) => {
 			if (err) return done(err);
 			expect(config.payload1.userId).to.be.equal(decoded.userId);
 			expect(config.payload1.userName).to.be.equal(decoded.userName);
 			done();
 		});
	});
	it('verification a expired token, must return with appropriate error', function(done) {
		verifyJWTToken(invalidToken, secret, (err, decoded) => {
			if (err) {
				expect(err).to.equal('invalid signature');
				done();
			}
			});
	});
	it('verification a invalid, must return with appropriate error', function(done) {
		verifyJWTToken('dsdsds', secret, (err, decoded) => {
 			if (err) {
 				expect(err).to.equal('jwt malformed');
 				done();
 			}
 			else {
 				return done('invalid token test case failed');
 			}

 		});
	});

});
