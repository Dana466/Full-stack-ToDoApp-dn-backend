const todoModel =require('../moduls/Todomodel')


module.exports.getToDo =async(req,res) =>{
// this code is before authentication
   // todoModel.find().then(result =>res.json(result))
   try {
    const todos = await todoModel.find({ userId: req.user._id }).sort({date: -1}); // sort -1 in order to add the new added task at the top 
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }


}

module.exports.saveToDo=async(req,res)=>{
// this is my code in the absecence of authentication 
/*const {text} =req.body

todoModel.create({text}).then((data) =>{
    console.log("Added Successfully...");
console.log(data);
//res.send(data)

res.json({
    code: 200,
    message: "Successfully created the required todo item.",
    Data: (data)
  });

})*/

try {
  const { text } = req.body;
  const userId = req.user._id;

  const newTodo = await todoModel.create({
    text,
    userId
  });

  res.json({
    code: 200,
    message: "Successfully created the required todo item.",
    data: newTodo
  });
} catch (err) {
  res.status(400).json({
    code: 400,
    message: "Error creating the todo item.",
    error: err.message
  });
}

}

module.exports.updateToDo=async(req,res)=>{
  const {id}= req.params;
  console.log(`the given id ${id} is updated successfully`);
  todoModel.findByIdAndUpdate({_id:id},{completed :true}).then(result =>res.send("Updated Successfully"))
  .catch(err =>res.json(err))  

  // i keep the default update with no authentication since in case the user is not accessed so he cann't  get or add to his database so there is nothing to update same as for delete  
    
}

module.exports.deleteToDo=async(req,res)=>{

   try {
    const todo = await todoModel.findByIdAndDelete(req.params.id);

    if (!todo) {
      res.status(404).send("No item found")
   } 
   else{
    res.status(200).send("the item is deleted")
  }
  } catch (err) {
    res.status(500).send(err);
  }
    
    }