const express=require("express");
const router=express.Router();
const verifyJWT=require("../middlewares/auth.middleware.js")
const {getAllTasks,createTask,updateTask,deleteTask}=require("../controllers/tasks")

router.use(verifyJWT);
router.route("/").get(getAllTasks)
router.route("/").post(createTask);
router.route("/:id").patch(updateTask)
router.route("/:id").delete(deleteTask);


module.exports=router;
        