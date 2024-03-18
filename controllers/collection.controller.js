const verifyJWT=require("../middlewares/auth.middleware.js") 
const User = require('../models/user.model.js');
const Collection = require('../models/collection.model.js');
const asyncHandler=require("../utils/asyncWrapper.js")
const mongoose = require("mongoose");

 mongoose.isValidObjectId()
const createCollection = asyncHandler(async(req,res)=>{

    let {title}=req.body;
    
    title=title?.trim();

    if(!title){
        return res.status(400).json({success:false,message:"Title is required",data:null});
    }

    const createdCollection=await Collection.create({
        title,
        createdBy:req.user._id
    });

    if(!createdCollection){
        return res.status(500).json({success:false,message:"Failed to create collection.",data:null});
    }

    res.status(201).json({success:true,message:"Collection created successfully",data:createdCollection});
});

const getCollections=asyncHandler(async(req,res)=>{

   const collections=await Collection.find({createdBy:req.user._id});
   
   if(collections.length<1){
    return res.status(404).json({success:false,message:"No collections found",data:null});
   }
   
   return res.status(200).json({success:true,message:"Collections fetched successfully",data:collections});
});

const editCollection=asyncHandler(async(req,res)=>{

    const {title}=req.body;
    const {collectionId}=req.params.collectionId;
    
    if(!mongoose.isValidObjectId(collectionId?.trim())){
      return res.status(400).json({success:false,message:"Invalid collection id",data:null});
    }

    if(!title?.trim()){
        return res.status(400).json({success:false,message:"Title is required",data:null});
    }
    
    const updatedCollection=await Collection.findByIdAndUpdate(collectionId?.trim(),{title},{new:true});

    if(!updatedCollection){
        return res.status(500).json({success:false,message:"Failed to update collection.",data:null});
    }
   return res.status(200).json({success:true,message:"Collection updated successfully",data:updatedCollection});
});

const deleteCollection=asyncHandler(async(req,res)=>{

    const {collectionId}=req.params.collectionId;

    if(!mongoose.isValidObjectId(collectionId?.trim())){
      return res.status(400).json({success:false,message:"Invalid collection id",data:null});
    }

    const deletedCollection=await Collection.findByIdAndDelete(collectionId?.trim());
    
    if(!deletedCollection){
        return res.status(500).json({success:false,message:"Failed to delete collection.",data:null});
    }
    return res.status(200).json({success:true,message:"Collection deleted successfully",data:deletedCollection});
});

module.exports={
    createCollection,getCollections,editCollection,deleteCollection
}