var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var serviceSchema= new Schema({
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
    servicename:String
	 
});
module.exports = mongoose.model("service", serviceSchema);