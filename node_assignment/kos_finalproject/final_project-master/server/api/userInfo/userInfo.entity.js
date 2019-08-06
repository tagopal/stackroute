let mongoose =  require('mongoose')
let schema =mongoose.Schema;
let Labels = new schema({
    name:String,
    noteIds:[String]
})
let sharedNoteList = new schema({
    userName:String,
    noteIds:[String],
    userId: String
})
let states = ["started", "not-started", "completed"]
let noteSchema = new schema({
    id: {
      type: String
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    state: {
      type: String,
      enum:states,
      default:'not-started'
    },
    userId: {
      type: String
    },
    createdOn: {
      type: String,
      default:Date.now
    },
    modifiedOn: {
      type: String,
      default:Date.now
    },
    labels: {
        type: [String]
    },
    favorite: {
        type: Boolean,
        default: false
    }
  })
let userInfoSchema = new schema({
    userId:{
        type:String,
    },
    favorites:{
        type:[String],
    },
    labels:[Labels],
    shareUserList:{
        type:[String],
    },
    sharedNoteList:{
        type:[noteSchema]
    }
});



// userSchema.index({
//     username:1
// },{
//     unique:true
// });
module.exports=mongoose.model('userInfo',userInfoSchema);