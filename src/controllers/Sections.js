const section = require('../models/section.model');
const User = require('../models/user.model');
const course = require('../models/course.model');
exports.createSection = async (req,res) => {
    try{
        const {sectionName,courseId} = req.body;
        if(!sectionName || !courseId)
            {
                return res.status(400).json({
                    success : false,
                    message : "require all fields"
                })
            }
        const sectionDetails = await section.create({sectionName: sectionName})
        const courseDetails = await course.findByIdAndUpdate({_id : courseId},
                                                             { $push : {courseContent : sectionDetails._id}},
                                                             {new:true}).populate(sectionDetails)

        return res.status(200).json({
            success : true,
            message : "section created successfully"
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "error while creating section"
        })
    }
}



exports.UpdateSection = async (req,res) => {
    try {
        const {sectionName,sectionId} = req.body;
        if(!sectionName)
            {
                return res.status(401).json({
                    success : false,
                    message : "require details"
                })
            }
        const UpdatedSection = await section.findOneAndUpdate({sectionId},{sectionName:sectionName},{new:true})
        return res.status(200).json({
            success : true,
            message : "section updated"
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "error while updating section"
        })
    }
}


exports.DeleteSection = async (req,res) => {
    try {
        const sectionId = req.params;
        if(!sectionId)
            {
                return res.status(401).json({
                    success : false,
                    message : "section not found"
                })
            }
        await section.findByIdAndDelete({sectionId})

        return res.status(200).json({
            success : true,
            message : "section deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "error while deleting section"
        })
    }
}