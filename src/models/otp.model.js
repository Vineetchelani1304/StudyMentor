const mongoose = require('mongoose');
const {mail} = require('../utils/mailSender')
const otpschema = new mongoose.Schema({
    otp : {
        type : Number,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5*60,
    }
});

// const verificationEmail = async (email,otp)=>{
//     try {
//         const response = await mail(email,"verification email is from studymrntor",otp)

//     } catch (error) {
//         console.log("error occured while verifying email",error);
//         throw error;
//     }
// }

// otpschema.pre('save', async function(next) {
//     await verificationEmail(this.email,this.otp);
//     next();
// })
// module.exports = mongoose.model("Otp",otpschema);
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mail(
			email,
			"Verification Email",
			otp
            );
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
otpschema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", otpschema);

module.exports = OTP;