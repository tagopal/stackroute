const userInfoModel = require('./userInfo.entity');
const getUserInfo = (req,res)=>{
    if(req.query.userId){
        userInfoModel.find({ userId: req.query.userId }, (err, response) => {
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

const setUserInfo = (req,res)=>{
    if(req.query.userId){
        userInfoModel.find({ userId: req.query.userId }, (err, response) => {
            if (err) {
                res.status(500).send({ message: "unexpected error" });
            }
            else {
                let count = response.length;
                console.log(response);
                console.log(count);
                if(!count){
                    let newInfo = new userInfoModel();
                    newInfo.userId = req.body.userId;
                    newInfo.favorites = req.body.favorites;
                    newInfo.labels = req.body.labels;
                    newInfo.save((err,response)=>{
                      if(err){
                        res.status(400).send({ message: "unexpected error" });
                      }else{
                        res.status(201).send(newInfo);
                      }
                    });
                }
                else{
                    userInfoModel.findOneAndUpdate({ userId: req.query.userId },req.body,{upsert: true},(err,data)=>{
                        if(data){
                            console.log("updated notes");
                            res.status(201).send({"message":"updated note","note":data})
                        }
                        if(err){
                            console.log("put notes error",err)
                        }
                        
                    })
                }
                
            }
        });
      }else{
        res.status(400).send({ message: "Please enter the user Id" });
      }
}

const removeUserInfo = (req,res)=>{
    userInfoModel.remove({ userId: req.query.userId },(err,data)=>{
        if(data){
            console.log("delete removeUserInfo function",data)
            res.status(201).send({"message":"delete removeUserInfo function","note":data})
        }else{
            console.log("delete removeUserInfo function",err)
        }
    })
}
module.exports = {
    getUserInfo,
    setUserInfo,
    removeUserInfo
}