var User = require('../model/user');
var service = require('../model/service');
var serviceRequest = require('../model/serviceRequest');
var comment = require('../model/comment');
var commanFunction = require('../module/commanFunctions');

exports.createRequest = (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
        res.send(commanFunction.apiResponse("Authentication token required add token", 200));
    }
    else if ((!req.body.serviceId) || (!req.body.description)) {
        res.send(commanFunction.apiResponse("serviceId and description Required", 200));
    }
    else {
        User.findOne({ token: token }).then(result => {
            console.log(result)
            if (!result) {
                res.send(commanFunction.apiResponse("Token not exist", 200));
            }
            else if (result.type == "user") {
                var details = {
                    customerId: result._id,
                    serviceId: req.body.serviceId,
                    status: "pending",
                    description: req.body.description
                }
                serviceRequest(details).save().then(result => {
                    res.send(commanFunction.apiResponse(result, "Successfully  Register", 200));
                })
            }
            else {
                res.send(commanFunction.apiResponse("Create request only by user or token not exist", 200));
            }
        })
    }
}

exports.deleteRequest = (req, res, next) => {
    var token = req.headers["x-access-token"];
    User.findOne({ token: token }).then(result => {
        console.log(result);
        if (!token) {
            res.send(commanFunction.apiResponse("Authentication token required add token", 200));
        }
        else if (!req.body.id) {
            res.send(commanFunction.apiResponse("ServieRequestId Required", 200));
        }
        if (!result) {
            res.send(commanFunction.apiResponse("Token not valid", 200));
        }
        else if (result.type == "user") {
            serviceRequest.findOne({ _id: req.body.id }).populate("serviceId")
                .then(data => {

                    console.log("data", data);
                    if (result._id.equals(data.customerId)) {
                        if (data.status == "accept") {

                            res.send(commanFunction.apiResponse("Sorry, your service request accepeting state", 200));
                        }
                        else {
                            serviceRequest.findOneAndRemove({ _id: req.body.id })
                                .then(result => {
                                    comment.remove({ serviceRequestId: req.body.id })
                                        .then(result => {
                                            res.send(commanFunction.apiResponse("Successfully deleted", 200));
                                        })
                                })
                        }
                    }
                    else {
                        res.send(commanFunction.apiResponse("Token not valid for this changestate", 200));
                    }
                })
        }
        else if (result.type == "serviceprovider") {
            serviceRequest.findOne({ _id: req.body.id }).populate("serviceId")
                .then(data => {
                    console.log(data)
                    if (result._id.equals(data.serviceId.serviceProviderId)) {
                        console.log(data);
                        if (data.status == "accept") {

                            res.send(commanFunction.apiResponse("Sorry, your service request accepeted", 200))
                        }
                        else {
                            serviceRequest.findOneAndRemove({ _id: req.body.id })
                                .then(result => {
                                    comment.remove({ serviceRequestId: req.body.id })
                                        .then(result => {
                                            res.send(commanFunction.apiResponse("Succussfully rejected", 200));
                                        })
                                })
                        }
                    }
                    else {
                        res.send(commanFunction.apiResponse("Token not valid for this changestate", 200));
                    }
                })
        }

    })
}

exports.getallServiceRequest = (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
        res.send(commanFunction.apiResponse("Authentication token required add token", 200));
    }
    var arr = [];
    User.findOne({ token: token }, { password: 0 }).then(result => {
        arr.push(result);
        if (!req.body.status) {
            service.find({ serviceProviderId: result._id }, { _id: 1 },
                async function (err, result) {
                    console.log(result.length)
                    await serviceRequest.find({ serviceId: result }).populate("serviceId").then(data => {
                        arr.push(data);
                    })
                    await res.send(commanFunction.apiResponse(arr, "Authenticate user", 200))
                })
        }
        else {
            console.log(result);
            service.find({ serviceProviderId: result._id }, { _id: 1 },
                async function (err, result) {
                    console.log(result.length)
                    await serviceRequest.find({ serviceId: result, status: req.body.status }).populate("serviceId").then(data => {

                        arr.push(data);
                    })
                    await res.send(commanFunction.apiResponse(arr, "Authenticate user", 200))
                })
        }
    })
}