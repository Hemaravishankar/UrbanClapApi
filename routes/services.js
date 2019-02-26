var express = require('express');
var router = express.Router();
const userController=require("../controller/user.controller");
const serviceController=require("../controller/service.controller");
const serviceRequestController=require("../controller/serviceRequest.controller");
const serviceProviderController=require("../controller/serviceProvider.controller");
const commentController=require("../controller/commentcontroller");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/updateUserInfo', userController.updateUserInfo);
router.put('/logout', userController.logout);
 
router.delete('/deleteUser', userController.deleteUser);

router.post('/addService', serviceController.addService);
router.put('/updateService', serviceController.updateService);
router.delete('/deleteService', serviceController.deleteService);
router.get('/showServices', serviceController.showServices);

router.post('/createRequest', serviceRequestController.createRequest);
router.delete('/deleteRequest', serviceRequestController.deleteRequest);
router.post('/getallServiceRequest', serviceRequestController.getallServiceRequest);

router.put  ('/changeStatus', serviceProviderController.changeStatus);

router.post('/addComment', commentController.addComment);

router.post('/getComment', commentController.getComment);



module.exports = router;
