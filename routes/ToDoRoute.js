const {Router} =require("express");
const { getToDo, saveToDo, deleteToDo, updateToDo } = require("../controllers/Todocontroller");
const auth =require('../authentication/auth')
const router=Router()

router.get('/',auth, getToDo)
router.post('/createtask', auth,saveToDo)
router.delete('/deletetask/:id',deleteToDo)
router.put('/updatetask/:id',updateToDo)


module.exports=router;