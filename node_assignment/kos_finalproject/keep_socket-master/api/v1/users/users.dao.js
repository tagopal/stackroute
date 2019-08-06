const userModel = require('./users.entity');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passportConfig = {
  secret:"secret"
}

const register = (req,res)=>{
    // let user = req.body;
    console.log(req.body);
    let username = req.body.username;
    userModel.findOne({username:username},(error,response)=>{
        console.log("result");
      if(error){
        res.status(500).send({message:"unexpected error"});
      }else if(response){
        res.status(200).send({message:"username is already exist"})
      }else{
        let newUser = new userModel();
        newUser.username = req.body.username;
        newUser.password = passwordHash(req.body.password);
        newUser.save((err,newUser)=>{
            if(err){
                res.status(404).json("Error")
            }else{
                res.status(201).send({"newUser":newUser.username})
            }
        });
      }
    })

}
const login = (req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  userModel.findOne({username:username},(error,response)=>{
    if(error){
        res.status(500).send({message:"unexpected error"});
    }else if(response){
      if(comparePassword(password,response.password)){
        let payload = {"id":response._id,"username":response.username,"password":response.password}
        let token = jwt.sign(payload,passportConfig.secret,{expiresIn:'3600000'})
        if(token){
          res.status(200).send({
                              "user": {
                                        "username": response.username,
                                        "userId":response._id
                                      },
                              "token": token
                        })
        }else{
          res.status(400).send({message:"unexpected error"})
        }

      }else{
        res.status(403).send({ message: "Passwords is incorrect" });
      }
    }else{
      res.status(403).send({ message: "You are not registered user" });
    }
  })
}

const getUsers = (req,res)=>{
  userModel.find((err,response)=>{
    if(err){
      res.status(404).json("Error")
    }else{
      res.status(200).send(response)
    }
  })
}

const passwordHash = (password)=>{
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePassword = (inputPass,dbPass) =>{
    return bcrypt.compareSync(inputPass, dbPass);
};

module.exports = {
  register,
  getUsers,
  login
}
