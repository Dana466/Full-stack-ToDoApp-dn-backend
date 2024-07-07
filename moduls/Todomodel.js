const { text } = require('express')
const mongoose =require('mongoose')

const todoSchema =new mongoose.Schema({

//text:{
   // type:String,
   // require:true
//}

text: {
    type: String,
  },
  userId: {
    type: String,
    default: '643bca55dd25ab961ffe3031'
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: Date.now
  }
  
})
module.exports=mongoose.model('ToDo',todoSchema)