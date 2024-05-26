const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        console.log("here we go");
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;
        console.log("token: " + token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing'
            });
        }

        try {
            console.log("verifying the token")
            const payLoad = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Payload:", payLoad);
            req.user = payLoad;

            // No need to return a response here, just call next()
            next();

        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        console.log("auth completed")

    } catch (error) {
        console.error("Authentication middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};



// exports.auth = async (req, res, next) => {
//     try{
//         //extract token
//         const token = req.cookies.token 
//                         || req.body.token 
//                         || req.header("Authorisation").replace("Bearer ", "");

//         //if token missing, then return response
//         if(!token) {
//             return res.status(401).json({
//                 success:false,
//                 message:'TOken is missing',
//             });
//         }

//         //verify the token
//         try{
//             const decode =  jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decode);
//             req.user = decode;
//         }
//         catch(err) {
//             //verification - issue
//             return res.status(401).json({
//                 success:false,
//                 message:'token is invalid',
//             });
//         }
//         next();
//     }
//     catch(error) {  
//         return res.status(401).json({
//             success:false,
//             message:'Something went wrong while validating the token',
//         });
//     }
// }





exports.isStudent = async (req,res,next)=>{
    try {
        if(req.user.AccountType !== "student")
            {
                return res.status(401).json({
                    success: false,
                    message : "this route is for Student's only"
                })
            }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "user role cannot be verified",
        })
    }
}

exports.isInstructor = async (req,res,next)=>{
    try {
        console.log("instructor middlewre is started")
        if(req.user.AccountType !== "instructor")
            {
                return res.status(401).json({
                    success: false,
                    message : "this route is for instructor's only"
                })
            }
        next();
        console.log("instructor middleware is ended")
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "user role cannot be verified",
        })
    }
}

exports.isAdmin = async (req,res,next)=>{
    try {
        console.log("here is admin pannel")
        if(req.user.AccountType !== "admin")
            {
                return res.status(401).json({
                    success: false,
                    message : "this route is for admin's only"
                })
                console.log("admin pannel completed here")
            }
            next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "user role cannot be verified",
        })
    }
}