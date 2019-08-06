let mongoose =  require('mongoose')
let schema =mongoose.Schema;
let reminderSchema = new schema({
    userId:{
        type:String,
    },
    date:{
        type:Date,
    }
});
module.exports=mongoose.model('reminder',reminderSchema);