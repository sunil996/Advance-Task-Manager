const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
      },
      dueDate: {
        type: Date,
      },
     collection:{
        type:mongoose.Types.ObjectId,
        ref:"Collection"
     }
 
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
