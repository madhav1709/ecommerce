var mongoose = require('mongoose');// defining a mongoose schema 
var Schema = mongoose.Schema;//declaring a schema

var cartSchema = new Schema({

    p_id 			: {type:Number},
	p_name  		: {type:String,default:''},
	p_color  	    : {type:String,default:''},
	p_size	  	    : {type:String,default:''},
	p_cost	  	    : {type:String,default:''},
	p_category	  	: {type:String,default:''},
	username	    : {type:String,require:true},
	userEmail       : {type:String,require:true}
	
});//cart model

mongoose.model('cart',cartSchema);