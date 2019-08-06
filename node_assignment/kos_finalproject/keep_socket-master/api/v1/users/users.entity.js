let mongoose =  require('mongoose')
let schema =mongoose.Schema;
let userSchema = new schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
userSchema.index({
    username:1
},{
    unique:true
});
module.exports=mongoose.model('user',userSchema);