const notesModel = require("./notes.entity");
const JSONStream = require('JSONStream');
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
      let postedNotes = req.body.data;
  
      notesModel.findOneAndUpdate(
          { userId: req.params.userId },
          {
              $set: {
                  sharedNote: postedNotes
              }
          },
          (err, notes) => {
              if (err) {
                //   console.log(err);
                  res.status(500).send({ message: "unexpected error" });
              } else {
                  
                  var io = req.app.get('socketio');
                  io.sockets.emit (req.params.userId, "notes has been shared with you");
                  res.status(200).send({message: 'Completed the request'});
              }
          });
  
  }
module.exports = {
  getNotes,
  addNotes,
  updateNotes,
  getStreamNotes,
  addStreamNotes,
  shareNotes
}
