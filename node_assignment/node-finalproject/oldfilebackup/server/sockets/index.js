const notesModel = require("../api/notes/notes.entity");
const userInfoModel = require("../api/userInfo/userInfo.entity");
const userModel = require("../api/users/users.entity");
module.exports = function (io){
    var clientList = {};
    io.on('connection', (socket) => {
        console.log("Connected to client id:"+(socket.id)+" client.address: "+(socket.client.address));
        socket.on("register", (data)=>{
            console.log("register");
            console.log(data);
            console.log(socket.id);
            clientList[data.userName] = socket.id;
            console.log("clientList");
            console.log(clientList);
        })

        socket.on("reminder",(data)=>{
            console.log("reminder");
            console.log(data);
        })
        socket.on("share", (data)=>{
            console.log("share");
            console.log(data);
            console.log(socket.id);
            console.log(clientList);
 
            userModel.find({ username: data.userName }, (err, response) => {
                if (err) {
                    res.status(500).send({ message: "unexpected error" });
                }
                else{
                    console.log("usermodel");
                    console.log(response);
                    if(response.length){
                        var updateUserId = response[0]._id;
                        userInfoModel.find({ userId: response[0]._id }, (err, res) => {
                            console.log("res");
                            console.log(res);
                            if (err) {
                                res.status(500).send({ message: "unexpected error" });
                            }
                            else {
                                if(!res.length){
                                    console.log("create new data");
                                    let newInfo = new userInfoModel();
                                    newInfo.userId = updateUserId;
                                    newInfo.favorites = [];
                                    newInfo.labels = [];
                                    newInfo.shareUserList = [];
                                    newInfo.sharedNoteList = [];
                                    var noteIds=[];
                                    data.notes.forEach(note=>{
                                        noteIds.push(note._id);
                                    })
                                    var obj={userName:data.sender.userName,userId:data.sender.userId,noteIds:noteIds}
                                    // newInfo.sharedNoteList.push(obj)
                                    newInfo.sharedNoteList= data.notes;
                                    console.log(newInfo);
                                    newInfo.save((err,response)=>{
                                      if(err){
                                        // res.status(400).send({ message: "unexpected error" });
                                        console.log(err);
                                      }else{
                                        // res.status(201).send(newInfo);
                                        console.log("create userInfo");
                                      }
                                    });
                                }
                                else{
                                    var userInfo = res[0];
                                    console.log("else part");
                                    var flag=0;
                                    console.log(userInfo.sharedNoteList);
                                    data.notes.forEach(note=>{
                                        console.log("data.notes.forEach");
                                        console.log(note);
                                        console.log(userInfo.sharedNoteList);
                                        var flag=0;
                                        userInfo.sharedNoteList.forEach(shareListNote=>{
                                            if(shareListNote._id==note._id){
                                                flag=1;
                                            }
                                        })
                                        if(flag==0){
                                            userInfo.sharedNoteList.push(note);
                                        }
                                    })
                                    console.log(userInfo);
                                    userInfoModel.findOneAndUpdate({ userId: updateUserId },userInfo,{upsert: true},(err,data)=>{
                                        if(data){
                                            console.log("updated userInfo");
                                        }
                                        if(err){
                                            console.log("put notes error",err)
                                        }
                                        
                                    })
                                }
                            }
                        })
                    }
                }
            })
            
            io.to(clientList[data.userName]).emit("sendMsg",data);
        })
        socket.on("addShareUser", (data)=>{
            console.log("addShareUser")
            console.log(data);
            userInfoModel.find({ userId: data.userId }, (err, response) => {
                if (err) {
                    res.status(500).send({ message: "unexpected error" });
                }
                else {
                    if(!response.length){
                        let newInfo = new userInfoModel();
                        newInfo.userId = data.userId;
                        newInfo.favorites = [];
                        newInfo.labels = [];
                        newInfo.shareUserList = [];                        
                        newInfo.save((err,response)=>{
                          if(err){
                            console.log(err);
                          }else{
                            console.log("create userInfo");
                          }
                        });
                    }
                    else{
                        if(!response[0].shareUserList.includes(data.shareUserName)){
                            console.log("else");
                            console.log(data);
                            response[0].shareUserList.push(data.shareUserName);
                            console.log(response[0])
                            userInfoModel.findOneAndUpdate({ userId: data.userId },response[0],{upsert: true},(err,data)=>{
                                if(data){
                                    console.log("updated userInfo");
                                }
                                if(err){
                                    console.log("put notes error",err)
                                }
                                
                            })       
                        }
                    }
                }
            })

        })
        socket.on("clientinfo", (data)=>{
           console.log("clientinfo:"+data);
            console.log("client details:"+(clients.getClient()[0]['username']));
        })
        
        socket.on('disconnect', () => { 
            console.log("Client disconnected");
        });
        socket.on('updateFav',(data)=>{
            console.log(data);
            console.log(data.notes);
            var notes = data.notes;
            let count = 0;
            var favIds = [];
            notes.forEach(note=>{
                favIds.push(note._id);
                note.favorite = data.state;
                console.log('inserted data');
                console.log(note);
                var query = {_id:note._id}
                notesModel.findOneAndUpdate(query,note,{upsert: true},(err,data)=>{
                    if(data){
                        count+=1;
                        if(count==notes.length){
                            // res.status(201).send({"message":"updated note","note":data})
                        }
                    }
                    if(err){
                        console.log("put notes error",err)
                    }
                    
                })
            })

            userInfoModel.find({ userId: data.userId }, (err, response) => {
                if (err) {
                    res.status(500).send({ message: "unexpected error" });
                }
                else {
                    if(!response.length){
                        let newInfo = new userInfoModel();
                        newInfo.userId = data.userId;
                        newInfo.favorites = favIds;
                        newInfo.labels = [];
                        newInfo.save((err,response)=>{
                          if(err){
                            console.log(err);
                          }else{
                             console.log("create userInfo");
                          }
                        });
                    }
                    else{
                        console.log("response")
                        console.log(response[0]);
                        console.log(response[0].favorites);
                        if(data.state){
                            favIds.forEach(id=>{
                                if(!response[0].favorites.includes(id)){
                                    response[0].favorites.push(id);
                                }
                            })
                        }
                        else{
                            favIds.forEach(id=>{
                                response[0].favorites = response[0].favorites.filter(mainId=>mainId!=id);
                            })
                        }
                        console.log(response[0].favorites);
                        console.log("inserting data");
                        console.log(response[0]);
                        userInfoModel.findOneAndUpdate({ userId: data.userId },response[0],{upsert: true},(err,data)=>{
                            if(data){
                                console.log("updated userInfo");
                            }
                            if(err){
                                console.log("put notes error",err)
                            }
                            
                        })       
                    }                 
                }
            });
        })

        socket.on('updateLabel',(data)=>{
            console.log(data);
            console.log(data.notes);
            var notes = data.notes;
            let count = 0;
            var noteIds = [];
            notes.forEach(note=>{
                noteIds.push(note._id);
                if(data.state){
                    note.labels.push(data.label);
                }
                else{
                    note.labels = note.labels.filter(label=>label!=data.label);
                }
                console.log('inserted data');
                console.log(note);
                var query = {_id:note._id}
                notesModel.findOneAndUpdate(query,note,{upsert: true},(err,data)=>{
                    if(data){
                        count+=1;
                        if(count==notes.length){
                            // res.status(201).send({"message":"updated note","note":data})
                        }
                    }
                    if(err){
                        console.log("put notes error",err)
                    }
                })
            })

            userInfoModel.find({ userId: data.userId }, (err, response) => {
                if (err) {
                    res.status(500).send({ message: "unexpected error" });
                }
                else {
                    if(!response.length){
                        let newInfo = new userInfoModel();
                        newInfo.userId = data.userId;
                        newInfo.favorites = [];
                        newInfo.labels = [{name:data.label,noteIds:noteIds}];
                        newInfo.save((err,response)=>{
                          if(err){
                            console.log(err);
                          }else{
                            console.log("create userInfo");
                          }
                        });
                    }
                    else{
                        console.log("label response")
                        console.log(response[0]);
                        console.log(response[0].labels);
                        var flag= 0;
                        response[0].labels.forEach(label=>{
                            if(label.name==data.label){
                                flag=1;
                            }
                        })
                        if(data.state){
                            console.log("flag "+flag);
                            if(flag==0){
                                console.log("push if");
                                console.log("label pushed");
                                response[0].labels.push({name:data.label,noteIds:noteIds});
                                console.log(response[0].labels);
                            }
                            else{
                                console.log("push else");
                                response[0].labels.forEach(label=>{
                                    if(label.name==data.label){
                                        noteIds.forEach(id=>{
                                            if(!label.noteIds.includes(id)){
                                                label.noteIds.push(id);
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else{
                            console.log("flag "+flag);
                            if(flag==0){
                                console.log("remove if");
                                console.log("label pushed");
                                response[0].labels.push({name:data.label,noteIds:[]});
                                console.log(response[0].labels);
                            }
                            else{
                                console.log("remove else");
                                response[0].labels.forEach(label=>{
                                    if(label.name==data.label){
                                        noteIds.forEach(id=>{
                                            label.noteIds = label.noteIds.filter(ids=>ids!=id);
                                        })
                                        console.log(label.noteIds);
                                    }
                                })
                            }
                            
                        }
                        console.log("inserting data");
                        console.log(response[0]);
                        userInfoModel.findOneAndUpdate({ userId: data.userId },response[0],{upsert: true},(err,data)=>{
                            if(data){
                                console.log("updated userInfo");
                            }
                            if(err){
                                console.log("put notes error",err)
                            }
                            
                        })
                    }
                }
            });
        })


        socket.on('removeLabel',(data)=>{
            console.log("removeLabel");
            console.log(data);
            userInfoModel.find({ userId: data.userId }, (err, response) => {
                if (err) {
                    res.status(500).send({ message: "unexpected error" });
                }
                else {
                    console.log("response");
                    console.log(response);
                    if(response.length){
                        console.log("inside if");
                        //remove label from all notes
                        response[0].labels.forEach(label=>{
                            console.log(label);
                            console.log(label.name);
                            if(label.name==data.label.name){
                                console.log(label);
                                console.log(label.noteIds);
                                label.noteIds.forEach(id=>{
                                    notesModel.find({ _id: id }, (err, res) => {
                                        if (err) {
                                            // res.status(500).send({ message: "unexpected error" });.
                                            console.log("unexpected error");
                                        }
                                        else {
                                            if(res.length){
                                                console.log("from label list id");
                                                console.log(res);
                                                res[0].labels = res[0].labels.filter(label=>label!=data.label.name);
                                                notesModel.findOneAndUpdate({ _id: id },res[0],{upsert: true},(err,data)=>{
                                                    if(data){
                                                        console.log("updated "+id);
                                                    }
                                                    if(err){
                                                        console.log("put notes error",err)
                                                    }
                                                })
                                            }
                                        //   res.status(200).send(response);
                                        }
                                    });
                                })
                            }
                        })    
                        
                        //remove label from Userinfo
                        response[0].labels = response[0].labels.filter(label=>label.name!=data.label.name);
                        console.log(response[0]);
                        userInfoModel.findOneAndUpdate({ userId: data.userId },response[0],{upsert: true},(err,data)=>{
                            if(data){
                                console.log("updated userInfo");
                            }
                            if(err){
                                console.log("put notes error",err)
                            }
                            
                        })
                    }
                }
            })
        })        
    });
  }