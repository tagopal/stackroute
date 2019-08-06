# StackRoute Keep Note
This a application which allows to maintain notes, grouping them and sharing with other users. It includes a Front End using Angular and a backend service running Node js. The Database used is MongoDB.

## Getting Started
The following instructions will guide you to setting up the Front End, Back end and MongoDB database.

### Prerequisites

Install the packages by running the following command in three seperate command line windows

#### Database
Install the mongoDB server by downloading from [here](https://www.mongodb.com/download-center/community).
The version used in this project is 4.0.

After installing, follow this tutorial to setup the server from [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/).

#### Back-End Service
Open a Command line terminal in /server folder and run the following command
```bash
npm install
```

#### Front-End Service
Open a Command line terminal in /FrontEnd folder and run the following command
```bash
npm install
```

### Running the application

#### Database

Open a Command line terminal and run the following command
```bash
mongod
```

#### Back-End Service

Open a Command line terminal in /server folder and run the following command

```bash
npm start
```

#### Front-End Service

Open a Command line terminal in /FrontEnd folder and run the following command

```bash
npm start
```

## Deployment

To deploy the Front-End application in production, you can Open a Command line terminal in /FrontEnd folder and run the following command

```bash
ng build --prod
```

This will create a static files, which can be hosted in a server.


## Built With

* Back-End: Node js with Express framework
* Front-End: Angular 5
* Database: MongoDB 4.0


## Versioning

1.0.0 

## Authors

* **Gopalakrishnan** - *Initial work*
