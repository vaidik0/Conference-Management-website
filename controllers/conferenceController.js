const User = require('../models/user');
const Conference = require('../models/conference');
const Announcement = require('../models/Announcement');

module.exports.createConference = function(req,res){
    return res.render('createConference');
}

module.exports.create = async function(req,res){
    let conference = await Conference.create(req.body);
    conference.status = "Pending Approval";
    conference.creator = req.user._id;
    conference.save();

    let user = await User.findById(req.user._id);
    user.conferences.push(conference);
    user.save();

    return res.redirect('back');
}

module.exports.home = async function(req,res){
    let user = await User.findById(req.user._id).populate('conferences');
    //console.log(user);
    return res.render('conference',{
        conferences:user.conferences
    });
}

module.exports.edit = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    if(conference.creator!=req.user.id){
        return res.redirect('back');
    }
    else{
        return res.render('editConference',{
            conference:conference
        });
    }
}

module.exports.update = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    if(!conference||conference.creator!=req.user.id){
        return res.redirect('/users/conferences');
    }
    else{
        conference.eventName = req.body.eventName;
        conference.startTime = req.body.startTime;
        conference.endTime = req.body.endTime;
        conference.description = req.body.description;
        conference.save();
        return res.redirect('/users/conferences');
    }
}

module.exports.cancel = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    await User.findByIdAndUpdate(req.user._id,{$pull:{conferences:req.params.id}});
    await Announcement.deleteMany({conference:req.params.id});
    conference.remove();
    return res.redirect('back');
}

module.exports.invite = async function(req,res){
    let conference = await Conference.findById(req.params.id).populate('invitedUsers');
    if(!conference||conference.creator!=req.user.id){
        return res.redirect('back');
    }
    else{
        return res.render('inviteUsers',{
            conference:conference
        });
    }
}

module.exports.sendInvitation = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    if(!conference){
        return res.redirect('back');
    }
    else{
        let user = await User.findOne({email:req.body.email});
        if(!user||user.id==req.user.id){
            console.log('User not found||Invitation not Allowed');
            return res.redirect('back');
        }
        else{
            conference.invitedUsers.push(user);
            conference.save();
            user.invitations.push(conference);
            user.save();
            return res.redirect('back');
        }
    }
}

module.exports.invitations = async function(req,res){
    let user = await User.findById(req.user._id).populate('invitations');
    return res.render('invitations',{
        conferences:user.invitations
    });
}

module.exports.accept = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    let user = await User.findByIdAndUpdate(req.user._id,{$pull:{invitations:req.params.id}});
    user.conferences.push(conference);
    user.save();
    return res.redirect('back');
} 

module.exports.announcements = async function(req,res){
    let conference = await Conference.findById(req.params.id).populate('announcements');
    return res.render('announcements',{
        creator:conference.creator,
        announcements:conference.announcements
    });
}

module.exports.announce = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    let announcement = await Announcement.create({
        content:req.body.content,
        conference:conference
    });
    conference.announcements.push(announcement);
    conference.save();
    return res.redirect('back');
}

module.exports.viewAnnouncements = async function(req,res){
    let conference = await Conference.findById(req.params.id).populate('announcements');
    return res.render('announcements',{
        creator:conference.creator,
        announcements:conference.announcements
    });
}

module.exports.withdrawParticipation = async function(req,res){
    let conference = await Conference.findByIdAndUpdate(req.params.id,{$pull:{invitedUsers:req.user._id}});
    let user = await User.findByIdAndUpdate(req.user._id,{$pull:{conferences:req.params.id}});
    return res.redirect('back');
}

module.exports.submitPaper = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    return res.render('submitPaper',{
        conference:conference
    });
}

module.exports.uploadPaper = async function(req,res){
    let conference = await Conference.findById(req.params.id);
    Conference.uploadedPaper(req,res,function(err){
        if(err){
            console.log('Multer Error Occured',err);
            return;
        }
        else{
            conference.paper = Conference.paper_path +'/'+req.file.filename;
            conference.status = "Paper Submitted";
            conference.save();
            return res.redirect('/users/conferences/');
        }
    });
}