var mongoose = require('mongoose');//import required modules
var express = require('express');
var userRouter = express.Router();//express routes
var cartModel = mongoose.model('cart')
var productModel = mongoose.model('Product')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");
var flash = require('express-flash');//express flash module

module.exports.controllerFunction = function (app) {

   userRouter.get('/addtocart/:p_name', auth.checkLogin, function (req, res) { 
    	productModel.findOne({'p_name': req.params.p_name} , function(err, addedproduct){
    		if(!err)
    		{
       if (req.params.p_name != undefined && req.params.p_name != null) {
            var newCart = new cartModel({
            	
	            p_id  		        : addedproduct.p_id,
	            p_name              : addedproduct.p_name,
                p_color             : addedproduct.p_color,
                p_size              : addedproduct.p_size,
                p_cost              : addedproduct.p_cost,
                p_category          : addedproduct.p_category,
                username            : req.session.user.username,
                userEmail           : req.session.user.email
            });

            newCart.save(function (err) {
                if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added" + err, 500, null);
                        res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                   
                    console.log('product added to cart');
                    req.flash('success', 'product has been added to the cart');
                    res.redirect('/newkart/products');
                }
            });
        }
    }
    else
    {
    	 console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added" + err, 500, null);
                        res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });
    }
    });
  });

  userRouter.get('/cart', auth.checkLogin, function (req, res) {//route to get cart
        cartModel.find({'username': req.session.user.username},function(err, addedproduct){
        		if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                        res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                	console.log(addedproduct);
                    res.render('cart2',{
                    	cart:addedproduct,
                    	user: req.session.user
                    });
                }
    });
  });
   

    userRouter.get('/cartdelete/:p_name', auth.checkLogin, function (req, res) {//route to remove items from cart
        cartModel.findOneAndRemove({ $and: [ {'p_name': req.params.p_name},{'username':req.session.user.username} ] } , function(err, addedproduct){
    		if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (addedproduct == null || addedproduct == undefined || addedproduct == undefined || addedproduct == '') {

                var myResponse = responseGenerator.generate(true, "product not found", 404, null);
                    res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/newkart/cart');
            }

        });          

    });

    app.use('/newkart', userRouter);

} //end cart controller
