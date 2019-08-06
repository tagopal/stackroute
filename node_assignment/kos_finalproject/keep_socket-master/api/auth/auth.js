let JwtStrategy = require('passport-jwt').Strategy;// type of authentication
let ExtractJwt = require('passport-jwt').ExtractJwt;//extracting token from the header
let userModel = require('../v1/users/users.entity');
const passport = require('passport');// authentication
const secret="secret";
const jwt = require('jsonwebtoken');


const signToken = (payload, secret, expireIn, callback) => {
    jwt.sign(payload, secret, { expiresIn: expireIn}, (err, token) =>{
        if(err) return callback(err.message);
        return callback(null,token);
    });
};

const verifyToken  = (token, secret, callback) =>{
    jwt.verify(token,secret,(err, decoded) =>{
      if(err) return callback(err.message);
        return callback(null,decoded);
    });
}
const initializeAuth =  ()=>{
    let options = {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey:secret
                  }
    passport.use(new JwtStrategy(options,(payload,done)=>{
        userModel.findById(payload.id,(err,user)=>{
            if(err){
                done(err,false)
            } else if(user){
                done(null,{username:user.username})
            }else{
                done(null,false)
            }
        })
    }))
}
const authenticate = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        postedToken = req.headers.authorization.split(' ')[1];
        verifyToken(postedToken,secret,(err,decoded)=>
        {   
            if(err){
                 res.status(403).send('invalid token');
            }else{
                req.userId = decoded.userId;
                next();
            }
        })
    } else {
        res.status(403).send('Not authenticated');
    }
}


module.exports = {
  initializeAuth,
  signToken,
  verifyToken,
  authenticate
}
