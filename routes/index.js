const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

router.get('/',homeController.home);
router.get('/contact',homeController.contact);
router.use('/users',require('./users'));
router.use('/admin',require('./admin'));
router.use('/reviewer',require('./reviewer'));

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Page Not Found!"
    });
});


module.exports = router;