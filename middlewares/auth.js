//auth.checkLogin, auth.seller(create req.sellerid)
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var responseGenerator = require('./../libs/responseGenerator');

exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		res.redirect('/newkart');
	}
	else{

		next();
		delete req.session.password;
	}

}// end checkLogin

