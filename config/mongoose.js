//Get mongoose
const mongoose = require('mongoose');

//Connect mongoose to the data base
mongoose.connect('mongodb://localhost/conference_users_db');

//Mongoose is connected to the db.Now, connection of mongoose gives access to data base
const db = mongoose.connection;

//If there is an error
db.on('error',console.error.bind(console,'error connecting to the database'));

//Up and Running then print the message
db.once('open',function(){
   console.log('Successfully connected to the database');
});

module.exports = db;