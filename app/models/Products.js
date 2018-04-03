var mongoose = require('mongoose');// defining a mongoose schema
var Schema = mongoose.Schema;// declare schema object.
var productSchema = new Schema({

	p_id 			: {type:Number},
	p_name  		: {type:String,default:''},
	p_color  	    : {type:String,default:''},
	p_size	  	    : {type:String,default:''},
	p_cost	  	    : {type:String,default:''},
	p_category	  	: {type:String,default:''}
	
});//product model

mongoose.model('Product',productSchema);