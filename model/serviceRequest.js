var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var serviceRequestSchema = new Schema({
	
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      serviceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service'
      },
      status:String,
      description:String
	 
});
module.exports = mongoose.model("serviceRequest", serviceRequestSchema);