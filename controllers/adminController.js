const User = require('../models/user');
const Conference = require('../models/conference');
const Announcement = require('../models/Announcement');

module.exports.home = async function(req,res){
    let user = await User.findById(req.user._id);
    let conference = await Conference.find({});
    let pending_conferences = [];
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        for(c of conference){
            if(c.status=="Pending Approval"){
                pending_conferences.push(c);
            }
        }
        return res.render('adminHome',{
            conferences:pending_conferences
        });
    }
}

module.exports.approve = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        let conference = await Conference.findById(req.params.id);
        conference.status = "Approved By Administrator";
        conference.save();
        return res.redirect('back');
    }
}

module.exports.reject = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        let conference = await Conference.findById(req.params.id);
        await User.findByIdAndUpdate(req.user._id,{$pull:{conferences:req.params.id}});
        await Announcement.deleteMany({conference:req.params.id});
        conference.remove();
        return res.redirect('back');
    }
}

module.exports.settings = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        let users = await User.find({});
        let admins = [];
        for(u of users){
            if(u.accountType=="Admin"){
                admins.push(u);
            }
        }
        return res.render('adminSettings',{
            admins:admins
        });
    }
}

module.exports.addAdmin = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        let targetUser = await User.findOne({email:req.body.email});
        if(!targetUser||targetUser.accountType=="Reviewer"){
            return res.redirect('back');
        }
        else{
            targetUser.accountType="Admin";
            targetUser.save();
            return res.redirect('back');
        }
    }
}

module.exports.removeAdmin = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Admin"){
        return res.redirect('/users/home');
    }
    else{
        let targetUser = await User.findById(req.params.id);
        if(!targetUser){
            return res.redirect('back');
        }
        else{
            targetUser.accountType="User";
            targetUser.save();
            return res.redirect('back');
        }
    }
}

module.exports.loginInfo = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType=="User"){
        return res.redirect('/users/home');
    }
    else{
        return res.render('adminLoginInfo',{
            profileUser:user
        });
    }
}