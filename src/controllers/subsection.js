const Section = require('../models/section.model');
const SubSections = require('../models/subsection.model');
const { findByIdAndUpdate } = require('../models/user.model');
const videoupload = require('../utils/ImageUploader')
require('dotenv').config();
exports.CreateSubSection = async (req,res) => {
    try {
        const {title,timeDuration,description,sectionId} = req.body;
        const VideoUrl = req.files.Video;
        if(!title || !description || !sectionId || !timeDuration || !VideoUrl)
            {
                return res.status(401).json({
                    success : false,
                    message : "all field are require :)"
                })
            }
        const videouploaded = await videoupload(VideoUrl,process.env.FOLDER_NAME)

        const SubSectionDetails = await SubSections.create({title, description,timeDuration,videoUrl : videouploaded.secure_url})
        console.log(SubSectionDetails)
        const UpdatedSection = await Section.findOneAndUpdate({_id : sectionId},{$push : {SubSectionDetails}},{new:true}).populate("subSection")
        console.log(UpdatedSection)
        return res.status(200).json({
            success : true,
            message : "subSection created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "error occured while creating subSection"
        })
        
    }
}


exports.UpdateSubSection = async (req,res) => {
    try {
        const {title,timeDuration,description,subSectionId} = req.body;
        const VideoUrl = req.files.Video;
        if(!title || !description || !subSectionId || !timeDuration || VideoUrl)
            {
                return res.status(401).json({
                    success : false,
                    message : "all field are require"
                })
            }
        const videouploaded = await videoupload(VideoUrl,process.env.FOLDER_NAME)
        const UpdatedSubSection = await findByIdAndUpdate({_id : subSectionId},
                                                            {title : title,
                                                             description : description,
                                                            timeDuration : timeDuration,
                                                             VideoUrl : videouploaded.secure_url},
                                                            {new : true})
        return res.status(200).json({
            success : true,
            message : "Subsection updated"
        })


    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Error while updating"
        })
    }
}


exports.deleteSubSection =async (req,res) => {
    try {
        const {sectionId,subSectionId} = req.body;

        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSections: subSectionId,
              },
            }
          )
        if (!sectionId) {
            return res.status(401).json({
                success : false,
                message : "all field are require"
            })
        }
        
        const subSection = await SubSections.findByIdAndDelete(subSectionId);

        if (!subSection) {
            return res
              .status(404)
              .json({ success: false, message: "SubSection not found" })
          }
        return res.status(200).json({
            success : true,
            message : "Subsection deleted"
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Error while deleting"
        }) 
    }
}