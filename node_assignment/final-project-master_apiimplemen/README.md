# StackRoute Keep Note

This application depicts the capabilities of adding a note, sharing notes with friends, setting reminder, grouping notes, marking as a favorite (single/group) and delete(single/group)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install needed packages by running command npm install in three seperate command line

1) for frontend -path: frontEnd/my-app -run: npm install

2) for backend -path: backend/userService -run: npm install

3) for backend -path: backend/noteService -run: npm install

 Install **Mongodb** from the official page- run on the port 27017

### Installing

For development purpose,

1) **Backend:** npm run devStart in two backend paths(backend/userService & backend/noteService)

2) **Frontend:** ng serve in fronend path(frontEnd/my-app)

For production purpose,

1) **Backend:** npm run start in two backend paths(backend/userService & backend/noteService)

2) **Frontend:** ng build --prod

3) Take the build angular project from dist/my-app in frontEnd folder(frontEnd/my-app/dist/my-app)

4) Serve the angular project in node js as shown in the example.js file


## Built With

* backend: nodejs-express framework
* frontend: Angular7
* Api gateway - Express Gateway framework


## Versioning

1.0.0 

## Authors

* **Gopalakrishnan ** - *Initial work*
