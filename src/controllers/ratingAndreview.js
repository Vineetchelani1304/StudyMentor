const ratingAndReview = require('../models/ratingAndReviews.model');
const course = require('../models/course.model')

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        const courseDetails = await course.findOne({
            _id: courseId,
            studentEnrolled : {$elemMatch: {$eq : userId}}
        });
        if(!courseDetails)
            {
                return res.status(404).json({
                    success : false,
                    message : 'Course not found'
                })
            }
        //student already have reviewed or not
        const student = await ratingAndReview.findOne({
            user : userId,
            course : courseId
        })
        if(student)
            {
                return res.status(400).json({
                    success: false,
                    message : 'Course already reviewed',
                })
            }

        const ratingDetails = await ratingAndReview.create({
            user : userId,
            rating,review,
            course : courseId
        });
        const updatedcourse = await course.findByIdAndUpdate({_id : courseId},{
            $push : { ratingAndReviews : ratingDetails._id}
        },{new : true});
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "error while creating rating and review"
        })
    }
}


//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await ratingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.getAllRatingReview = async (req, res) => {
    try{
            const allReviews = await ratingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}