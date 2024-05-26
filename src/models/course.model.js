const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    courseName : {
        type: 'string',
        required: true
    },
    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Section',
        }
    ],
    description : {
        type: 'string',
        required: true
    },
    instructor :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        // required: true,
    },
    price : {
        type : 'string',
        required: true,
    },
    ratingAndReviews : {
        type : 'string',
        // required: true,
    },
    thumbNail : {
        type : 'string',
        required: true,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required: true
    },
    studentEnrolled : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            // required : true,
        }
    ],
    status : {
        type : 'string',
        enum : ["Draft","Published"],
    },
    tags : {
        type :String,
        required : true
    }
});

module.exports = mongoose.model("Course",courseSchema);