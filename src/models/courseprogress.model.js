const mongoose = require('mongoose');

const courseProgress = new mongoose.Schema({
    courseId :{
        type: mongoose.SchemaType.ObjectId,
        required: true,
        ref : 'Course',
    },
    completedVideos : [
        {
            type: mongoose.SchemaType.ObjectId,
            ref : 'SubSection',
        }
    ],
})

module.exports = mongoose.model('CourseProgress',courseProgress);