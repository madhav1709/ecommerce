var mongoose = require( 'mongoose' );// defining a mongoose schema
var userSchema = new mongoose.Schema({// declare schema object.
     category            : String,
     username            : {type: String, unique:true},
     email_id            : {type: String, unique:true},
     name                : String,
     mobile_no           : Number,
     password            : {type: String},
     company_name        : String,
     company_address     : String,
     createdOn           : {  type: Date,    default: Date.now }
     
});
//user model


mongoose.model( 'User', userSchema );
