const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    taskname: { 
        type : String,
        required : true,
    },
    done: { 
        type : Boolean,
        required : true,
    }
  });
 
const todo = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    } ,
    priority : {
        type : String,
        required : true,
    } ,
    checklists: [subSchema] ,
    duedate : {
        type : String
    }
  });
 
module.exports = mongoose.model('Todo', todo); 