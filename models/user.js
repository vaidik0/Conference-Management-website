const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String
    },
    address:{
        type:String
    },
    accountType:{
        type:String
    },
    institutionName:{
        type:String
    },
    conferences:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conference'
    }],
    invitations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conference'
    }]
},{
    timestamps:true
});

const User = mongoose.model('User',userSchema);

module.exports = User;


