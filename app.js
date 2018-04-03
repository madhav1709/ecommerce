//jai shri ram
var express = require('express');//import all modules
var app = express();
var session = require('express-session'); //module to maintain sessions
var logger = require('morgan');//module to log all the activity
var bodyParser = require('body-parser');//module to handle http post requests
var cookieParser = require('cookie-parser');
var path = require('path');//module to get all the files available
var flash = require('express-flash');//module to alert after a success or error
var mongoose = require('mongoose');//mongoDB object modelling tool 

var dbPath = "mongodb://localhost/newcart";
db = mongoose.connect(dbPath);
mongoose.connection.once('open', function () {
console.log("******Successfully Connected******");
});

var Shutdown = function (msg, callback) {  //defining function
  mongoose.connection.close(function () {  //to run when connection closed
    console.log('Mongoose disconnected through ' + msg);  
    callback();                                           
  });
};

process.once('SIGUSR2', function () {    //for nodemon when it restarts the server to gracefully shutdown database 
  Shutdown('nodemon restart', function () {  
    process.kill(process.pid, 'SIGUSR2');            
  });
});
process.on('SIGINT', function () {   //for nodemon when it restarts the server to gracefully shutdown database 
  Shutdown('app termination', function () {   
    process.exit(0);                                  
  });
});

process.on('SIGTERM', function() {  //when heroku emits process to gracefully shutdown database   
  Shutdown('Heroku app shutdown', function () { 
    process.exit(0);                                    
  });
});


app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(cookieParser());
app.use(flash());

//App level middleware
app.use(session({//session middlewar init
    name: 'CustomCookie',
    secret: 'furydragon', // custom encryption key 
    resave: true,
    httpOnly: true, 
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.set('view engine', 'jade'); // set the templating engine 
app.use(express.static(__dirname + '/public')); //set the public folder
app.set('views', path.join(__dirname + '/app/views'));//set the views folder

var fs = require('fs');//module for file management
fs.readdirSync('./app/models').forEach(function (file) {// include all our model files
        if (file.indexOf('.js')) //check if file is of .js type
        require('./app/models/' + file);//include the file 

}); 

fs.readdirSync('./app/controllers').forEach(function (file) {// include all our controller files
    if (file.indexOf('.js')) { 
        var route = require('./app/controllers/' + file);
        
        route.controllerFunction(app)//passing yuor app instance

    }

}); 

app.use(function (err, req, res, next) { //for general errors
    res.status(err.status || 500);
    if (err.status == 404) {
        res.render('404', {
            message: err.message,
            error: err
        });
    } else {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
});

app.listen(3000, function () {
    console.log('Magic is happening on port 3000! please visit localhost:3000/newkart to enjoy the magic');
});
