const User = require('../models/user.model');
require('dotenv').config();
const {mail} = require('../utils/mailSender');
const bcrypt = require('bcrypt')
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(403).json({
                success: false,
                message: "enter the email please"
            })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }
        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 3*60)
        const userdetails = await User.findOneAndUpdate({email:email},{token:token, tokenExpiresIn:expires},{new : true});

        const url = `http://localhost:3000/api/v1/password-update${token}`;
        await mail(email,"update password",`reset your password using this link: ${url}`);


        return res.status(200).json({
            success: true,
            message : "mail sent successfully"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "something went wrong could'nt change the password "
        })
    }
}


exports.resetpassword = async (req,res) => {
    try {
        const {password,confirmPassword,token} = req.body;
        if(!token) {
            return res.status(401).json({
                success: false,
                message : "token missing"
            })
        }
        const user = await User.findOne({token : token});
        if(password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message : "password did not match",
            })
        }

        if(!(user.tokenExpiresIn <= Date.now())) {
            return res.status(401).json({
                success : false,
                message : "token expired"
            })
        }
        const encryptedPassword = await bcrypt.hash(password,10);

        const updateuser = await User.findOneAndUpdate({token},{password : encryptedPassword},{new:true});

        return res.status(200).json({success:true,
            message : "password changed succesfully"});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "could'nt chnage the password",
        })
        
    }
}