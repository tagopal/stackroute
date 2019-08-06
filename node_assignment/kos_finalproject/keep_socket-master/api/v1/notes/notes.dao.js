const notesModel = require("./notes.entity");
const JSONStream = require('JSONStream');

// var sampleNote={
//     id:'1',
//     title:'greetings',
//     text:'hi',
//     state:'not-started',
//     userId:'1',
//     createdOn: new Date(),
//     modifiedOn: new Date()
// }

var sampleNote = [
    {
        "state": "not-started",
        "_id": "5cd946140ee6cd2668fcc6e2",
        "createdOn": "1557743124011",
        "modifiedOn": "1557743124011",
        "id": "1",
        "title": "greetings",
        "text": "hi",
        "userId": "1",
        "__v": 0,
        "emailId":"email@gmail.com"
    }
]
var sharedNotes =[];
const getNotes = (req,res)=>{
  if(req.query.userId){
    notesModel.find({ userId: req.query.userId }, (err, response) => {
        if (err) {
            res.status(500).send({ message: "unexpected error" });
        }
        else {
          res.status(200).send(response);
        }
      });
  }else{
    res.status(400).send({ message: "Please enter the user Id" });
  }
}

const addNotes = (req,res)=>{
  if(req.query.userId){
    notesModel.find({ userId: req.query.userId }, (err, response) => {
        if (err) {
            res.status(500).send({ message: "unexpected error" });
        }
        else {
            let count = response.length;
            let newNote = new notesModel();
            newNote.id =   count+1;
            newNote.title = req.body.title;
            newNote.text = req.body.text;
            newNote.state = req.body.state;
            newNote.userId = req.query.userId;
            newNote.save((err,response)=>{
                // console.log(response);
              if(err){
                res.status(400).send({ message: "unexpected error" });
              }else{
                res.status(201).send(newNote);
              }
            });
        }
    });
  }else{
    res.status(400).send({ message: "Please enter the user Id" });
  }
}

const updateNotes = (req,res)=>{
    let noteId = req.params.id;
    notesModel.findOneAndUpdate({"id": noteId},{$set:{"title":req.body.title,"text":req.body.text,"state":req.body.state}},{new:true}, (err, result) => {
          if (err) {const notesModel = require("./notes.entity");

          const getNotes = (req,res)=>{
            if(req.query.userId){
              notesModel.find({ userId: req.query.userId }, (err, response) => {
                  if (err) {
                      res.status(500).send({ message: "unexpected error" });
                  }
                  else {
                    res.status(200).send(response);
                  }
                });
            }else{
              res.status(400).send({ message: "Please enter the user Id" });
            }
          
          }
          
          const addNotes = (req,res)=>{
            if(req.query.userId){
              notesModel.find({ userId: req.query.userId }, (err, response) => {
                  if (err) {
                      res.status(500).send({ message: "unexpected error" });
                  }
                  else {
                      let count = response.length;
                    //   let userId = req.query.userId;
                      let newNote = new notesModel();
                      newNote.id =   count+1;
                      newNote.title = req.body.title;
                      newNote.text = req.body.text;
                      newNote.state = req.body.state;
                      newNote.userId = req.query.userId;
                      newNote.save((err,response)=>{
                        if(err){
                          res.status(400).send({ message: "unexpected error" });
                        }else{
                          res.status(201).send(response);
                        }
                      });
                  }
              });
            }else{
              res.status(400).send({ message: "Please enter the user Id" });
            }
          }
          
          const updateNotes = (req,res)=>{
              let noteId = req.params.id;
              notesModel.findOneAndUpdate({"id": noteId},{$set:{"title":req.body.title,"text":req.body.text,"state":req.body.state}},{new:true}, (err, result) => {
                    if (err) {
                        res.status(500).send({ message: "unexpected error" });
                    }
                    else {
                        res.status(200).send(result);
                    }
                });
          }
          module.exports = {
            getNotes,
            addNotes,
            updateNotes
          }
          
              res.status(500).send({ message: "unexpected error" });
          }
          else {
              res.status(200).send(result);
          }
      });
}
const getStreamNotes = (req,res)=>{
    if(req.query.userId){
        notesModel
          .find({ userId: req.query.userId })
          .cursor()
          .pipe(JSONStream.stringify())
          .pipe(res.type('json'))
    }else{
      res.status(400).send({ message: "Please enter the user Id" });
    }
  
  
  }
  
  const addStreamNotes = (req,res)=>{
    // console.log("adding notes thru stream")
    if(req.body.message==""){
        res.status(403).send();
    }
    fs.createReadStream('./server/mock_notes.json')
        .pipe(JSONStream.parse('*'))
        .pipe(writableStream)
    writableStream.on('finish', () => {
            // console.log('done!');
            res.status(201).send("response sent");
        });
  }
  
  const shareNotes = (req,res)=>{
    var io = req.app.get('socketio');
    sharedNotes.push(req.body);
    io.emit("sharenotes", {message: "Received new notes", data: sampleNote});
    res.status(201).send({ message: "Shared Successfully" });
  
  }
  const getShareNotes = (req,res)=>{
    // res.status(200).send({data:sharedNotes});
    if(req.query.userId){
        notesModel.find({ userId: req.query.userId }, (err, response) => {
            if (err) {
                res.status(500).send({ message: "unexpected error" });
            }
            else {
              res.status(200).send(response);
            }
          });
      }else{
        res.status(200).send({ message: "Get all the notes" });
      }
    // var io = req.app.get('socketio');
    // io.emit("sharenotes", {message: "Received new notes", data: sampleNote})
  }
module.exports = {
  getNotes,
  addNotes,
  updateNotes,
  getStreamNotes,
  addStreamNotes,
  shareNotes,
  getShareNotes
}
