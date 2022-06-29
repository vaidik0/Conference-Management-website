const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/userControllers');
const homeController = require('../controllers/homeController');


router.get('/login',usersController.login);
router.get('/signup',usersController.signup);
router.post('/create',usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'},
),usersController.createSession);
router.get('/home',homeController.home);
router.get('/destroy-session',passport.checkAuthentication,usersController.destroySession);
router.get('/profile',passport.checkAuthentication,usersController.profile);
router.get('/settings',passport.checkAuthentication,usersController.settings);
router.post('/updateLoginInfo',passport.checkAuthentication,usersController.updateLoginInfo);
router.post('/updateAccountInfo',passport.checkAuthentication,usersController.updateAccountInfo);
router.use('/conferences',require('./conferences'));
router.get('/reset-password',usersController.reset);
router.post('/reset-password',usersController.sendResetLink);
router.get('/reset-password/:token',usersController.resetPassword);
router.post('/changePassword/:token',usersController.changePassword);
router.get('/verify-email/:token',usersController.verifyUserEmail);
router.post('/contactMessage',usersController.contactMessage);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),usersController.createSession);

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Page Not Found!"
    });
});


module.exports = router;