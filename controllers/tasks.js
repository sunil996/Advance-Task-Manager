
const Task=require("../models/task.model");
const {asyncWrapper} =require("../utils/asyncWrapper.js")

const getAllTasks=async(req,res)=>{

  try {
     
    const tasks = await Task.find();
    res.status(200).json({ tasks:tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg:err});
  }
}

const createTask = async (req, res) => {
    try {
      const task = await Task.create(req.body);
      res.status(201).json({ task }); 
    } catch (err) {
      res.status(500).json({ msg:err });
    }
  };
  

const getTask=asyncWrapper(async(req,res)=>{ 
   
  const id=req.params.id;
  const task = await Task.find({_id:id});

  if(!task){
     res.status(404).json({msg:`No task with id:${id}`});
  }
  res.status(200).json({ task:task });

});

const updateTask=async(req,res)=>{
  try {
    
    const id=req.params.id;
    const task = await Task.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true});
   
    if(!task){
      return res.status(404).json({msg:`No task with id:${id}`});
    }
    res.status(200).json({ task:task });
   } catch (error) {
    res.status(500).json({msg:error})
   }
}
 
const deleteTask=async(req,res)=>{
     try {
      const id=req.params.id;
      const task = await Task.findOneAndDelete({_id:id});
  
      if(!task){
        return res.status(404).json({msg:`No task with this id:${id}`});
      }
      res.status(200).json({ task:task });
     } catch (error) {
      res.status(500).json({msg:error})
     }
}

module.exports={
    getAllTasks,createTask,getTask,updateTask,deleteTask
}