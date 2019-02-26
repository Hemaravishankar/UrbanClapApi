var User = require('../model/user');
var service = require('../model/service');
var serviceRequest = require('../model/serviceRequest');
var addComment = require('../model/comment');
var commanFunction = require('../module/commanFunctions');

exports.addComment = (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
        res.send(commanFunction.apiResponse("Authentication token required add token", 200));
    }
    else {
        User.findOne({ token: token }).then(results => {

            serviceRequest.findOne({ _id: req.body.serviceRequestId }).populate("serviceId").then(result => {
                console.log(result)

                if ((results.type == "user") || (results.type == "serviceprovider")) {
                    if ((results._id.equals(result.customerId)) || (results._id.equals(result.serviceId.serviceProviderId))) {
                        if (result.status == "accept") {
                            var addCommenst = new addComment({
                                userId: results._id,
                                serviceRequestId: req.body.serviceRequestId,
                                comment: req.body.comment,
                            });

                            addComment(addCommenst).save()
                                .then(result => {
                                    res.send(commanFunction.apiResponse(result, "User comment successfully add", 200));
                                })
                        }
                        else {
                            res.send(commanFunction.apiResponse("This request Pending or rejected state", 200));
                        }
                    }
                    else {
                        res.send(commanFunction.apiResponse("This request not attach with your tokenId", 200));
                    }
                }
                else {
                    res.send(commanFunction.apiResponse("Specify type name", 200));
                }
            })

        })
    }
}


exports.getComment = (req, res, next) => {

    addComment.find({ serviceRequestId: req.body.serviceRequestId }).then(result => {
       
        res.send(commanFunction.apiResponse(result,"Show all comments", 200));
    })
}