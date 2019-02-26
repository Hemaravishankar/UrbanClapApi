var User = require('../model/user');

exports.apiResponse=(data,msg,statuscode)=>{
    var apiResponseVar={
        data:data,
        msg:msg,
        statuscode:statuscode
    }
    return apiResponseVar;
}

exports.verifyToken=(token,callback)=>{
    User.find({ token: token }).then(responseuser => {
        if(!responseuser)
        {
            callback(null);
        }
        else{
            callback(responseuser);
               }

    });
}