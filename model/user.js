var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{type:String,
        required:"name required"},
	email:{
        type:String,
        required:"EmailId required",
        unique:'email must be unique',
        match : [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,"Enter valid email address"]
    },
    password:{
        type:String,    
        required:"Password required",
         
      },
    type:{type :String,
        required:"UserType required",},
    token:String,
      
});

const userData=mongoose.model("user", userSchema);

userData.createIndexes();

module.exports =userData;