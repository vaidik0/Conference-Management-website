const Conferece = require('../models/conference');
const User = require('../models/user');

module.exports.reviewhome = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let conferences = await Conferece.find({status:"Paper Submitted"});
        return res.render('reviewerhome',{
            conferences:conferences
        });
    }
}

module.exports.Settings = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let users = await User.find({});
        let reviewers = [];
        for(u of users){
            if(u.accountType=="Reviewer"){
                reviewers.push(u);
            }
        }
        return res.render('reviewerSettings',{
            reviewers:reviewers
        })
    }
}

module.exports.addReviewer = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let targetUser = await User.findOne({email:req.body.email});
        //console.log(targetUser.accountType);
        if(!targetUser||targetUser.accountType=="Admin"){
            return res.redirect('back');
        }
        else{
            targetUser.accountType="Reviewer";
            targetUser.save();
            return res.redirect('back');
        }
    }
}

module.exports.removeReviewer = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
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
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        return res.render('reviewerLoginInfo',{
            profileUser:user
        });
    }
}

module.exports.viewPaper = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let conference = await Conferece.findById(req.params.id);
        return res.render('viewPaper',{
            conference:conference
        });
    }
}

module.exports.acceptPaper = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let conference = await Conferece.findById(req.params.id);
        conference.status = "Reviewed and Accepted";
        conference.save();
        return res.redirect('back');
    }
}

module.exports.rejectPaper = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType!="Reviewer"){
        return res.redirect('/users/home');
    }
    else{
        let conference = await Conferece.findById(req.params.id);
        conference.status = "Reviewed and Rejected";
        conference.save();
        return res.redirect('back');
    }
}