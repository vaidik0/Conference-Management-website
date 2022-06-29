const User = require('../models/user');
const jwt = require('jsonwebtoken');
const resetPassword = require('../models/reset-password');
const emailVerificationMailer = require('../mailers/emailVerification_mailer');
const verifyEmail = require('../models/verifyEmail');
const messageMailer = require('../mailers/messageMailer');
const passwordsMailer = require('../mailers/passwords_mailer');

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('back');
    }
    else{
        return res.render('login');
    }
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('back');
    }
    else{
        return res.render('signUp');
    }
}

module.exports.conferences = function(req,res){
    return res.render('conference',{
        profileUser:req.user
    });
}

module.exports.create = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            console.log('User Already Exists');
            return res.redirect('/users/signup');
        }
        else{
            let verifyemail = await verifyEmail.create({
                email:req.body.email,
                accesstoken: jwt.sign({email:req.body.email},"secretCode",{expiresIn:'10000000'}),
                isValid: true,
                password:req.body.password,
                name:req.body.name
            });

            emailVerificationMailer.verify(verifyemail);

            return res.render('notification-template',{
                message:"An email has been sent to your email account for verification"
            });
        }
    }catch(err){
        return res.redirect('/users/signup');
    }
}

module.exports.createSession = async function(req,res){
    let user = await User.findById(req.user._id);
    if(user.accountType=="Admin"){
        return res.redirect('/admin/home');
    }
    else if(user.accountType=="Reviewer"){
        return res.redirect('/reviewer/home');
    }
    else{
        return res.redirect('/users/home');
    }
}

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/users/login');
}

module.exports.profile = async function(req,res){
    let user = await User.findById(req.user.id);
    if(!user){
        return res.redirect('/users/home');
    }
    else{
        return res.render('profile',{
            profileUser:user
        });
    }
}

module.exports.settings = async function(req,res){
    let user = await User.findById(req.user.id);
    if(!user){
        return res.redirect('/users/home');
    }
    else{
        var flag = user.gender==="Male";
        return res.render('setting',{
            profileUser:user,
            flag:flag
        });
    }
}

module.exports.updateLoginInfo = async function(req,res){
    let user = await User.findById(req.user._id);
    if(!user){
        return res.redirect('back');
    }
    else{
        user.email = req.body.email;
        user.password = req.body.password;
        user.save();
        return res.redirect('back');
    }
}

module.exports.updateAccountInfo = async function(req,res){
    let user = await User.findById(req.user._id);
    if(!user){
        return res.redirect('back');
    }
    else{
        user.name = req.body.name;
        user.gender = req.body.gender;
        user.institutionName = req.body.institutionName;
        user.address = req.body.address;
        user.save();
        return res.redirect('back');
    }
}

module.exports.reset = function(req,res){
    return res.render('reset-password');
}

module.exports.sendResetLink = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(!user){
            console.log('user not found');
            return res.redirect('back');
        }
        let reset_password = await resetPassword.create({
            user: user._id,
            accesstoken: jwt.sign(user.toJSON(),"secretCode",{expiresIn:'10000000'}),
            isValid: true
        });
        let reset_Password = await resetPassword.findById(reset_password._id).populate('user');
        passwordsMailer.reset(reset_Password);

        return res.render('notification-template',{
            message:"A link to reset password has been sent to your email account"
        });

    }catch(err){
        console.log('An error occured',err);
        return res.redirect('back');
    }

}

module.exports.resetPassword = async function(req,res){
    try{
        let accessToken = req.params.token;
        let user_account = await resetPassword.findOne({accesstoken:accessToken});
        if(user_account){
            return res.render('changePassword',{
                token:accessToken
            });
        }
        else{
            return res.render('notification-template',{
                message:"Invalid or expired token"
            });
        }
    }catch(err){
        return res.redirect('/users/login');
    }
}

module.exports.changePassword = async function(req,res){
    let password = req.body.password;
    let confirm_password = req.body.confirmPassword;
    if(password!=confirm_password){
        console.log('password mismatch');
        return res.redirect('back');
    }
    let accessToken = req.params.token;
    let user_account = await resetPassword.findOne({accesstoken:accessToken});
    if(user_account&&user_account.isValid==true){
        let user = await User.findById(user_account.user);
        if(user){
            user.password = password;
            user.save();

            await resetPassword.deleteMany({user:user_account.user});

            user_account.remove();
            return res.redirect('/users/login');
        }
        else{
            console.log('User not found');
            return res.redirect('back');
        }
    }
    else{
        return res.render('notification-template',{
            message:"Invalid or Expired Token"
        });
    }
}

module.exports.contactMessage = function(req,res){
    let message = req.body;
    messageMailer.sendMessage(message);
    return res.redirect('back');
}

module.exports.verifyUserEmail = async function(req,res){
    try{
        let accessToken = req.params.token;
        let email_to_verify = await verifyEmail.findOne({accesstoken:accessToken});
        if(email_to_verify){
            let user = await User.create({
                email:email_to_verify.email,
                password:email_to_verify.password,
                isAdmin:false,
                name:email_to_verify.name
            });

            await verifyEmail.deleteMany({email:email_to_verify.email});

            email_to_verify.remove();
            return res.redirect('/users/login');
        }
        else{
            return res.render('notification-template',{
                message:"Invalid or expired token"
            });
        }
    }catch(err){
        console.log('An Error Occurred',err);
        return res.redirect('/users/login');
    }
}