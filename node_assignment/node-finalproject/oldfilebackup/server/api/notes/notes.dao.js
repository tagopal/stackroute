const notesModel = require("./notes.entity");

const getAllNotes = (req,res)=>{
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


const removeNotes = (req,res)=>{
    var notes = req.body;
    var length = notes.length
    var i=0
    console.log(notes);
    console.log(length);
    notes.forEach(note=>{
        var query = {_id:note._id}
        notesModel.remove(query,(err,data)=>{
            if(data){
                i++;
                if(i==length){
                    res.status(201).send("sucessfully deleted")
                }
                console.log("delete notes function",data)
            }else{
                console.log("delete notes function",err)
            }
        })
    })
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
    console.log("req.body",req.body);
    let notes = req.body;
    let count = 0;
    notes.forEach(note=>{
        var query = {_id:note._id}
        notesModel.findOneAndUpdate(query,note,{upsert: true},(err,data)=>{
            if(data){
                count+=1;
                if(count==notes.length){
                    res.status(201).send({"message":"updated note","note":data})
                }
            }
            if(err){
                console.log("put notes error",err)
            }
            
        })
        
    })
}

module.exports = {
    getAllNotes,
    removeNotes,
  getNotes,
  addNotes,
  updateNotes
}
