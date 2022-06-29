const express = require('express');
const router = express.Router();
const passport = require('passport');

const conferenceController = require('../controllers/conferenceController');

router.get('/createConference',passport.checkAuthentication,conferenceController.createConference);
router.post('/create',passport.checkAuthentication,conferenceController.create);
router.get('/',passport.checkAuthentication,conferenceController.home);
router.get('/edit/:id',passport.checkAuthentication,conferenceController.edit);
router.post('/update/:id',passport.checkAuthentication,conferenceController.update);
router.get('/cancel/:id',passport.checkAuthentication,conferenceController.cancel);
router.get('/invite/:id',passport.checkAuthentication,conferenceController.invite);
router.post('/sendInvitation/:id',passport.checkAuthentication,conferenceController.sendInvitation);
router.get('/invitations',passport.checkAuthentication,conferenceController.invitations);
router.get('/accept/:id',passport.checkAuthentication,conferenceController.accept);
router.get('/announcement/:id',passport.checkAuthentication,conferenceController.announcements);
router.post('/announce/:id',passport.checkAuthentication,conferenceController.announce);
router.get('/viewAnnouncements/:id',passport.checkAuthentication,conferenceController.viewAnnouncements);
router.get('/withdrawParticipation/:id',passport.checkAuthentication,conferenceController.withdrawParticipation);
router.get('/submitPaper/:id',passport.checkAuthentication,conferenceController.submitPaper);
router.post('/submitPaper/:id',passport.checkAuthentication,conferenceController.uploadPaper);

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Page Not Found!"
    });
});


module.exports = router;