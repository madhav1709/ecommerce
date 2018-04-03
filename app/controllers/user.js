var mongoose = require('mongoose');//using mongoose module for connection with mongodb
var express = require('express');
var userRouter = express.Router();// express router
var flash = require('express-flash');//flash module for showing info,message,successs
var nodemailer = require('nodemailer');
var userModel = mongoose.model('User')
var auth = require("./../../middlewares/auth");//middleware
var responseGenerator = require('./../../libs/responseGenerator');//response generator

var smtpTransport = nodemailer.createTransport({ //SMTP is the main transport in Nodemailer for delivering messages
 service: 'gmail',
 auth: {
        user: 'demoreset3@gmail.com',
        pass: 'dragon12@'
    }
});

module.exports.controllerFunction = function (app) {

     userRouter.get('/', function (req, res) { //to get index page
        res.render('index');
    });

     userRouter.get('/layout', function (req, res) { //to get layout
        res.render('layout', { user : req.session.user.name });
    });

     userRouter.get('/layoutse', function (req, res) {  //to get seller layout
        res.render('layoutse', { user : req.session.user.name });
    });
     userRouter.get('/login/screen', function (req, res) {  // to get login screen
        res.render('login'); 
    });
     //end get login screen

     userRouter.get('/signup/customer', function (req, res) { // to get signup page for customer or user
      res.render('signup');
    });
     //end get signup screen
     userRouter.get('/signup/seller', function (req, res) { //to get signup page for seller 
      res.render('signupse');
    });

     userRouter.get('/dashboard', auth.checkLogin, function (req, res) { //to get dashboard  for user
      res.render('dashboard', {
            user: req.session.user
        });
       });
     userRouter.get('/dashboardseller', auth.checkLogin,function (req, res) {//to get dashboard for seller
      res.render('dashboardse2', {
            user: req.session.user
        });
       });
     
     userRouter.get('/logout', function (req, res) { //logout 
       req.session.destroy(function(err) {
       res.redirect('/newkart');
       });
     });//end logout

     userRouter.get('/forgot', function (req, res) { //to get forgot password 
     res.render('forgot');
      });

     userRouter.post('/signup/user', function (req, res) { // post method for signup of customer or user
          if(req.body.username!=undefined && req.body.name!=undefined && req.body.email_id!=undefined && req.body.password!=undefined){

               var newUser = new userModel({
                    category            : 'User',
                    username            : req.body.username,
                    name                : req.body.name,
                    email_id            : req.body.email_id,
                    mobile_no           : req.body.mobile_no,
                    password            : req.body.password
                    //createdOn           : Date.now()

               });
               newUser.save((err) =>{ //es6 notation Arrow functions are a short syntax, introduced by ECMAscript 6.
                    if(err){
                         console.log(err);
                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.render('error', {
                              message: myResponse.message,
                              error: myResponse.data
                         });
                    }
                    else{
                         req.session.user = newUser;
                         delete req.session.user.password;
                         res.redirect('/newkart/layout')
                    }
               });//end save new user
          }
          
     });


     userRouter.post('/signup/seller', function (req, res)  { //post method for signup of seller
          if(req.body.username!=undefined && req.body.name!=undefined && req.body.email_id!=undefined && req.body.company_name!=null && req.body.password!=undefined){

               var newUser = new userModel({
                    
                    category            : 'Seller',
                    username            : req.body.username,
                    name                : req.body.name,
                    email_id            : req.body.email_id,
                    mobile_no           : req.body.mobile_no,
                    password            : req.body.password,
                    company_address     : req.body.company_address,
                    company_name        : req.body.company_name,
                    //createdOn           : Date.now()

               });
               newUser.save(function(err) { //new seller save
                    if(err){

                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.render('error', {
                              message: myResponse.message,
                              error: myResponse.data
                         });
                    }
                    else{
                         req.session.user = newUser;
                         delete req.session.user.password;
                         res.redirect('/newkart/layoutse')
                    }
               });//end newseller save
          }
          
     });

     userRouter.post('/login', function (req, res) { 
         userModel.findOne({$and:[{'email_id':req.body.email_id},{'password':req.body.password}]},function(err,foundUser){
               if(err){
                    var myResponse = responseGenerator.generate(true,"Sorry for trouble.Please try again"+err,500,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else if(foundUser==null || foundUser==undefined || foundUser.username==undefined){ //checking if value of founduser is null or undefined

                    var myResponse = responseGenerator.generate(true,"incorrect email/password. Check your email and password",404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else{
                    req.session.user = foundUser;//it is an app level midddleware which stores information about current user
                    delete req.session.user.password;//good practice to delete password so that no one else can access
                    if (req.session.user.category === 'User') {
                         res.redirect('/newkart/layout');
                    }
                    else{
                         res.redirect('/newkart/layoutse');
                    }
               }
          });
     });
     userRouter.post('/forgot', function (req, res) { // post method for forget password
         userModel.findOne({'email_id': req.body.email_id }, function(err, foundUser) {
            if (err) {
               var errorResponse = responseGenerator.generate(true, 'email not found', 500, null);
                res.send(errorResponse);
            }
            else if (foundUser==null || foundUser == undefined || foundUser.email_id == undefined) { //checking if value of founduser is null or undefined
             var errorResponse = responseGenerator.generate(true, 'email not existing ', 500, null);
                req.flash('error', 'No account with that email address exists.');
                res.render('error', {
                    message: errorResponse.message,
                    status: errorResponse.status
                });
            }
            else { //nodemailer options to send mail
                    var mailOptions = {
                    to: req.body.email_id,
                    subject: 'Password Request',
                    html: '<h3>As per your request we are sending you your password if not requested please ignore it</h3>' +  foundUser.password 
                };

               smtpTransport.sendMail(mailOptions, function(error, response) {
                    if (err) {
                    var errorResponse = responseGenerator.generate(true, 'email could not be sent', 500, null); //if error in sending mail 
                    res.render('error', {
                    message: errorResponse.message,
                    status: errorResponse.status
                });
              }
                        
                    else
                        
                        console.log("Message sent");
                        res.redirect('/newkart');
                        //req.flash('success', 'E-mail has been sent to'+ user.email_id);

                });
            }
        });

    });
   
     app.use('/newkart', userRouter);//customise your api and also making it global to use as middleware
};//end of user controller
