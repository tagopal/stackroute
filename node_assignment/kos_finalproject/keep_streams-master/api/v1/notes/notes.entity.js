let mongoose =  require('mongoose')
let schema =mongoose.Schema;
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
  }
})

module.exports = mongoose.model("note",noteSchema)
