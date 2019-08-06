## Design & implement, Notes Application as a personal productivity tool for quickly taking (& saving) notes, organize notes efficiently. Below are requirements those needs to implement.

- Merge **nodejs-keep-level-2-assignment** boiler plate with your old project **nodejs-keep-level-1-assignment**. Follow below given steps to merge
	- Merge all test files in test folder
	- Merge modules.js file
	- Merge problem.md file
	- No need to update other files and folder.

- JWT Token module
	- Create a module, which only does JWT token signing and verifying
	- Refer to the methods from this module in **module.js** appropriately
	- You are expected to provide unit tests to this module
	- The signature expected is **signToken(payload, secret, expireIn, callback)** and **verifyToken(token, secret, callback)**
	- Refer these modules appropriately in **module.js**

- Modify existing API **api/v1/users/login**
	- After successful login, response should be look like **{token: token, user: {userName: userName, userId: userId}, status: 200}**
	- Token payload will contain **userName** and **userId** in the token payload.
	- Token should have expiry time, which is passed while generating the token

- All API for notes
	- All API will be accessible only to authenticated request
	- Only requests with valid token in the Authentication header will succeed, others should get valid HTTP response code and message
	- Write appropriate unit tests to test the authenticated access of the API

- Other instructions
	- Authorization header should be set as **Bearer**.
	- Use of jsonwebtoken npm module to generate and verify token instead **passportjs**.
	- If any notes api called without header, it should return **Not authenticated** message. 
	- Error handling should be done properly in whole application. If any error occurs in Generate and verify token methods, then it should send error message only not whole error object. No need to customize any error message just send as it is.
	- Seed code can be cloned form https://gitlab-cts.stackroute.in/stack_nodejs/nodejs-keep-level-2-assignment.git

## MENTORS TO BEGIN REVIEW YOUR WORK ONLY AFTER 

- You add the respective Mentor as a Reporter/Master into your Assignment Repository
- You have checked your Assignment on the Automated Evaluation Tool - Hobbes (Check for necessary steps in your Boilerplate - README.md/PROBLEM.md file. ) and got the required score - Check with your mentor about the Score you must achieve before it is accepted for Manual Submission. 
- Intimate your Mentor on Slack and/or Send an Email to learner.support@stackroute.in - with your Git URL - Once you done working and is ready for final submission.