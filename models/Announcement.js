const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    conference:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conference',
    }
},{
    timestamps:true
});

const Announcement = mongoose.model('Announcement',announcementSchema);
module.exports = Announcement;