const otpSchema = require('../models/otp.model');
const User = require('../models/user.model')
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const profile = require('../models/profile.model');
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser');
const { mail } = require('../utils/mailSender');
const OTP = require('../models/otp.model');
const otptemplate = require('../mail/templates/emailVerificationTemplate')

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is already registered
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure the OTP is unique
        let result = await otpSchema.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await otpSchema.findOne({ otp: otp });
        }

        // Create OTP entry in the database
        const otpBody = await otpSchema.create({ email, otp });

        // Send OTP to the user's email (assuming a mailSender function is available)
        await mail(email, "OTP Generated succesfully",otptemplate(otp) ); // Ensure mailSender function is defined and used correctly

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: otpBody
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            AccountType,
            otp
        } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp || !AccountType) {
            return res.status(403).json({
                success: false,
                message: "Please fill all the details"
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Check if the email is already registered
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
            return res.status(401).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Verify OTP
        console.log("Checking OTP for email:", email);
        const otpResponse = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("OTP response:", otpResponse);

        if (otpResponse.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No OTP found for the email"
            });
        }

        if (otp !== otpResponse[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user's profile
        const userProfile = await profile.create({
            gender: null,
            dateOfBirth: null,
            contactNumber: null,
            about: null
        });

        // Create the new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            AccountType: AccountType,
            additionalDetails: userProfile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        console.log("New user created:", newUser);

        // Respond with success
        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        console.error("Error creating user:", error); // Improved logging
        return res.status(500).json({
            success: false,
            message: 'Error creating user',
        });
    }
};

//Login page
exports.Login = async (req,res) => {
    try {

        const { email, AccountType, password } = req.body;

        if (!email || !password || !AccountType) {
            return res.status(401).json({
                success: false,
                message: 'Please enter valid credentials'
            })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'User not found'
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    AccountType: user.AccountType
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            )

            user.token = token;
            await user.save();
            user.password = undefined;

            const Option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, Option).json(
                {
                    success: true,
                    token,
                    user,
                    message: "user logged in successfully"
                }
            )
            console.log(user)

        }
        else {
            return res.status(403).json(
                {
                    success: false,
                    message: "Invalid password"
                }
            )
        };
    } catch (error) {
        console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
    }
}


exports.changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "please enter your details",
            })
        }
        const user = User.findOne({ email: email });
        if (bcrypt.compare(password, user.password)) {
            const newPassword = req.body;
            const confirmNewPassword = req.body;
            if (confirmNewPassword !== newPassword) {
                return res.status(403).json({
                    success: false,
                    message: "new Password does not match with confirm password",
                })
            }
            const pass = bcrypt.hash(newPassword, 10);
            const uu = await user.findOneAndUpdate({ email }, { password: pass }, { new: true });

            mail(email, "password changed", "password changed successfully")
            return res.status(200).json({
                success: true,
                message: "password changed successfully",
            })
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password does not match please try again",
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing the password",
        })
    }
}
