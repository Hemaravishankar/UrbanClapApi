var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var commentSchema = new Schema({
	
    serviceRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceRequest'
      },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      comment:String,
     
});
module.exports = mongoose.model("comment", commentSchema);