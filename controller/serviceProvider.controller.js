var User = require('../model/user');
var service = require('../model/service');
var serviceRequest = require('../model/serviceRequest');
var commanFunction = require('../module/commanFunctions');

exports.changeStatus = (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
        res.send(commanFunction.apiResponse("Authentication token required add token", 200));
    }
    else if ((!req.body.serviceRequestId) || (!req.body.status)) {
        res.send(commanFunction.apiResponse("Comment and serviceRequestId requires", 200));
    }
    else {
        User.findOne({ token: token })
            .then(result => {
                if (!result) {
                    res.send(commanFunction.apiResponse("Enter Proper token value", 200));
                }
                else if (result.type == "serviceprovider") {

                    serviceRequest.findOne({ _id: req.body.serviceRequestId }).populate("serviceId").then(element1 => {
                        if (!element1) {
                            res.send(commanFunction.apiResponse("Enter Proper token value", 200));
                        }
                        else if (result._id.equals(element1.serviceId.serviceProviderId)) 
                        {

                            if((element1.status==req.body.status))
                            {
                                res.send(commanFunction.apiResponse("Already up to date", 200));
                            }
                            if((element1.status=="accept" && (req.body.status=="pending" || req.body.status=="reject")) )
                            {
                                res.send(commanFunction.apiResponse("Request in accept state can not change pending or reject state", 200));
                            }
                            if(element1.status=="reject" && (req.body.status=="accept" || req.body.status=="pending"))
                            {
                                res.send(commanFunction.apiResponse("Request in reject state can not change accept or pending state", 200));
                            }
                             
                            if((element1.status=="pending" && req.body.status=="reject") || (element1.status=="pending" && req.body.status=="accept") || (element1.status=="accept" && req.body.status=="completed"))
                            {
                                serviceRequest.findOneAndUpdate({ _id: req.body.serviceRequestId }, { $set: { status: req.body.status } }).then(result => {

                                    res.send(commanFunction.apiResponse(result, "sucessfully accpeted request", 200));
                                })
                            }
                        }
                        else {
                            res.send(commanFunction.apiResponse("Token not valid for this changestate", 200));
                        }
                    })
                }
                else {
                    res.send(commanFunction.apiResponse("Change status by serviceprovider", 200));
                }
            })
    }
}
