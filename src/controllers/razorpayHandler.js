const {instance} = require('../config/razorpay');
const user = require('../models/user.model')
const course = require('../models/course.model')
const mailsender = require('../utils/mailSender')
exports.capturePayment = async (req, res) => {
    const {course_id} = req.body;
    const user_id = req.user.id;
    if(!course_id) {
        return res.status(401).json({
            success: false,
            message: 'Please enter valid course id'
        })
    }
    try {
        const courseDetails = await course.findById(course_id)
        if(!courseDetails) {
            return res.status(401).json({
                success: false,
                message : "invalid course"
            })
        }
        user_id = new mongoose.types.ObjectId(user_id)
        if(courseDetails.studentEnrolled.included(user_id)) {
            return res.status(400).json({
                success : false,
                message : "included student already in the course"
            })
        }
    } catch (error) {
        
    }

    const Amount = courseDetails.price;
        const currency = "INR";
        const options = {
            Amount : Amount * 100,
            currency,
            notes:{
                courseId : course_id,
                userId : user_id
            }
        }
        try {
            const payment = instance.orders.create(options);
            console.log(payment)
            return res.status.json({
                success: true,
                coursename : course.courseName,
                Amount : payment.Amount,
                orderId : payment.id,
                currency : payment.currency,
                thumbnail : course.thumbNail
            })
        } catch (error) {
            
        }
}


exports.VerifySignature = async (req,res) => {
    const webHookSecret = "12345678";
    const Signature = req.header["x-razorpay-signature"];

    const shaSum = crypto.createHmac("sha256",webHookSecret);

    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex");

    if(Signature === digest)
        {
            console.log("payment is Authorized");

            const {courseId, userId} = req.body.payload.payment.entity.notes;
            try {
                const enrolledCourse = await course.findByIdAndUpdate({_id : courseId},{$push:{studentEnrolled:userId}},{new:true})

                if(!enrolledCourse){
                    return res.status(500).json({
                        success:false,
                        message:"course not found"
                    })
                }
                console.log(enrolledCourse)

                const enrolledStudent = await user.findByIdAndUpdate({_id : userId},{$push:{courses:courseId}},{new:true})
                console.log(enrolledStudent);

                const emailresponse = await mailsender(enrolledStudent.email,"course enrollment","course successfully purchased... ")

                return res.status(200).json({
                    success:true,
                    message : "course purchase succesfully"
                })

            } catch (error) {
                return res.status(500).json({
                    success:false,
                    message:"error while purchasing the course if money deducted will surelly get refunded into your account with 48hr's"
                })
            }
        }
        else{
            return res.status(400).json({
                success : false,
                message : "invalid request"
            })
        }
}