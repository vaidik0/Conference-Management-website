const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const PAPER_PATH = path.join('/uploads/conferences/papers');

const conferenceSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    status:{
        type:String
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    capacityOfRoom:{
        type:String,
        required:true
    },
    invitedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    announcements:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Announcement'
    }],
    paper:{
        type:String
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',PAPER_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});


// static methods  
conferenceSchema.statics.uploadedPaper = multer({storage:storage}).single('paper');
conferenceSchema.statics.paper_path = PAPER_PATH;
  

const Conference = mongoose.model('Conference',conferenceSchema);

module.exports = Conference;