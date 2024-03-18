const Task=require("../models/task.model");
const Collection=require("../models/collection.model");
const asyncHandler =require("../utils/asyncWrapper.js")

const getAllTasks=asyncHandler(async(req,res)=>{

  const{collectionId}=req.params.collection;

  if(!mongoose.isObject(collectionId)){
    return res.status(400).json({success:false,message:"Invalid collection id",data:null});
  }

  const alltasks=Task.find({collection:collectionId})
  
  if(!alltasks){
    return res.status(500).json({success:false,message:"Failed to get tasks.",data:null});
  }
  if (alltasks.length === 0) {
    return res.status(404).json({ success: false, message: "No tasks found for the provided collection ID", data: [] });
 }

  return res.status(200).json({success:true,message:"Tasks fetched successfully",data:alltasks});
});

const createTask=asyncHandler(async (req, res) => {
    
  let {title, priority,dueDate,collection}=req.body;
  
  if(!title?.trim()){
    return res.status(400).json({success:false,message:"Title is required",data:null});
  }

  if(!dueDate?.trim()){
    return res.status(400).json({success:false,message:"due date is required",data:null});
  }

  if(!collection?.trim()){
    return res.status(400).json({success:false,message:"Collection is required",data:null});
  }
 
    const task = await Task.create({
    title: title.trim(),
    priority: priority || 'Medium',  
    dueDate: dueDate,
    collection: collection
  });

  if(!task){
    return res.status(500).json({success:false,message:"Failed to create task.",data:null});
  }

  return res.status(201).json({success:true,message:"Task is created successfully.",data:task})

  });
 

const updateTask=asyncHandler(async(req,res)=>{

  let { taskId } = req.params; 
  let {title, collection,dueDate}=req.body;
  let updateableFields={};

  if(!mongoose.isObject(taskId)){
    return res.status(400).json({success:false,message:"Invalid task id",data:null});
  }

  if(title?.trim()){
    updateableFields.title=title.trim();
  }

  if(collection?.trim()){
    updateableFields.collection=collection.trim();
  }

   if(dueDate?.trim()){
    updateableFields.dueDate=dueDate.trim();
   }
   
   if(Object.keys(updateableFields).length==0){                                                                                                                       
    return res.status(400).json({ success: false, message: "No valid updateable fields provided", data: null });                                               
   }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateableFields, { new: true });

    if (!updatedTask) {
        return res.status(404).json({ success: false, message: "Task not found", data: null });
    }

    return res.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
   
})
 
const deleteTask=asyncHandler(async(req,res)=>{
 
  let { taskId } = req.params;
  
  if(!mongoose.isObject(taskId)){
    return res.status(400).json({success:false,message:"Invalid task id",data:null});
  } 

  const deletedTask = await Task.findByIdAndDelete(taskId?.trim());
  
  if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found", data: null });
  }
  
  return res.status(200).json({ success: true, message: "Task deleted successfully", data: deletedTask });
  
})

module.exports={
    getAllTasks,createTask,updateTask,deleteTask
}