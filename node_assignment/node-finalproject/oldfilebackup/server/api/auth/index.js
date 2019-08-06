const auth = require('./auth')
const secret="secret";
const VerifyToken = (req,res)=>{
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        postedToken = req.headers.authorization.split(' ')[1];
        auth.verifyToken(postedToken,secret,(err,decoded)=>
        {   
            if(err){
                 res.status(403).send('invalid token');
            }else{
                req.userId = decoded.userId;
                res.status(200).send({'isAuthenticated':true});
            }
        })
    } else {
        res.status(403).send('Not authenticated');
    }
}

module.exports = {
    VerifyToken
}