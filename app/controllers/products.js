var mongoose = require('mongoose');
var express = require('express');
var userRouter = express.Router();
var productModel = mongoose.model('Product')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");

module.exports.controllerFunction = function (app) {
    
    userRouter.get('/products/add', auth.checkLogin, function (req, res) {
        res.render('productadd');//route to add product only by seller
    });

    
    userRouter.get('/products/edit', auth.checkLogin, function (req, res) {
        res.render('edit1');//route to edit product by product name
    });

   
     userRouter.get('/products/delete', auth.checkLogin, function (req, res) {
        res.render('delete');//route to delete a product
    });

      userRouter.get('/products', auth.checkLogin, function (req, res) { //route to find the list of products
    	productModel.find(function(err,addedproduct)
    	{
    		if(err)
    		{
                    var myResponse = responseGenerator.generate(true, "products not found", 404, null);
                    res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
    		}
    		else
    		{
    			//console.log(addedproduct);
    			res.render('indexuser', {user: req.session.user,products: addedproduct});
            }
         });
        
    });
   userRouter.get('/seller/products', auth.checkLogin, function (req, res) { //route for seller to get list of products
    	productModel.find(function(err,addedproduct)
    	{
    		if(err)
    		{

    			var myResponse = responseGenerator.generate(true, "products not found", 404, null);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
    		}
    		else
    		{
    			//console.log(addedproduct);
    			res.render('indexseller', {user: req.session.user,products: addedproduct});
    		}
        });
        
    });
  
  userRouter.post('/products/add', auth.checkLogin, function (req, res) {//adding products using post method
   if (req.body.p_id != undefined && req.body.p_name != undefined && req.body.p_color != undefined && req.body.p_size != undefined && req.body.p_cost != undefined && req.body.p_category != undefined ) {
                var newProduct = new productModel({

                p_id       : req.body.p_id,
                p_name     : req.body.p_name,
                p_color    : req.body.p_color,
                p_size     : req.body.p_size,
                p_cost     : req.body.p_cost,
                p_category : req.body.p_category
            

            });
            console.log(req.body.p_id + '' + req.body.p_name + '' + req.body.p_color + '' + req.body.p_size + '' + req.body.p_cost + '' + req.body.p_category);
            //logs for the product added
            newProduct.save(function (err) {
                if (err) {
                    console.log("error has occured please check logs...");
                    var myResponse = responseGenerator.generate(true, "error has occured please check logs... " + err, 500, null);
                        res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                    req.session.product = newProduct;//app level middleware for storing and getting the stored information at that particular session
                    console.log(req.session);
                    res.redirect('/newkart/seller/products');
                }
            });
        }
    });

  userRouter.post('/productedit', auth.checkLogin, function (req, res) { //finding the particular product to edit by product name 
       productModel.findOne({'p_name': req.body.p_name} , function(err, addedproduct){
            if (err) {
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not available " + err, 500, null);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
            	if(addedproduct == null || addedproduct == undefined)
            	{
            	console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not available " + err, 500, null);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            	}
            	else
            	{
                req.session.product = addedproduct;
                console.log(req.session);
                res.render('edit2');
            }
            }
        });

    });

  userRouter.post('/productedit1', auth.checkLogin, function (req, res) { //editing the selected product
     productModel.findOne({'p_name': req.session.product.p_name} , function(err, addedproduct){
       			if (err) {
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not available " + err, 500, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                
                
            console.log(addedproduct);
            addedproduct.p_id         = req.body.p_id;
            addedproduct.p_name       = req.body.p_name;
            addedproduct.p_color      = req.body.p_color;
            addedproduct.p_size       = req.body.p_size;
            addedproduct.p_cost       = req.body.p_cost;
            addedproduct.p_category   = req.body.p_category;
            
            addedproduct.save(function(err){
              if(err){
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not available " + err, 500, null);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
              }
              else{
                	req.session.product = addedproduct;
                console.log("product updated...");
               console.log(res.session);
                res.redirect('/newkart/seller/products');
              }
            });
            
          }


        });

    });

     userRouter.post('/delete', auth.checkLogin, function (req, res) { //deleting a particular product by product name
        productModel.findOneAndRemove({'p_name': req.body.p_name}, function (err, foundProduct) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundProduct == null || foundProduct == undefined || foundProduct.p_name == undefined ) {

                var myResponse = responseGenerator.generate(true, "product not found or not available", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/newkart/seller/products');
            }

        });
    });


    app.use('/newkart', userRouter);
}//ending products controller