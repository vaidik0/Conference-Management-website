const express = require('express');
const router = express.Router();
const passport = require('passport');
const reviewerController = require('../controllers/reviewerController');

router.get('/home',passport.checkAuthentication,reviewerController.reviewhome);
router.get('/settings',passport.checkAuthentication,reviewerController.Settings);
router.post('/addReviewer',passport.checkAuthentication,reviewerController.addReviewer);
router.get('/removeReviewer/:id',passport.checkAuthentication,reviewerController.removeReviewer);
router.get('/login-info',passport.checkAuthentication,reviewerController.loginInfo);
router.get('/viewPaper/:id',passport.checkAuthentication,reviewerController.viewPaper);
router.get('/acceptPaper/:id',passport.checkAuthentication,reviewerController.acceptPaper);
router.get('/rejectPaper/:id',passport.checkAuthentication,reviewerController.rejectPaper);

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Page Not Found!"
    });
});


module.exports = router;