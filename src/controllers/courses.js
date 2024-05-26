const Course = require('../models/course.model')
const User = require('../models/user.model');
// const Tags = require('../models/category.model');
const uploadImage  = require('../utils/ImageUploader')
const Category = require('../models/category.model')

exports.createCourse = async (req, res) => {
    try {
        const { courseName, description, price, tags, category } = req.body;
        // Extract thumbnail correctly from req.files
        console.log(courseName, description, price, tags, category)
        const thumbNail  = req.files.thumbNail; 
        // Check if all required fields are provided
        if (!courseName || !description || !price || !tags || !category || !thumbNail) 
        { 
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        // Check if the user is an instructor
        if (!instructorDetails || instructorDetails.AccountType !== 'instructor') { // Corrected instructor check
            return res.status(403).json({
                success: false,
                message: "User must be an instructor to create a course",
            });
        }

        const categoryDetails = await Category.findById(category); // Corrected method to find category
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const thumbnailDetails = await uploadImage(thumbNail, process.env.FOLDER);
        console.log(thumbnailDetails);

        const newCourse = await Course.create({
            courseName,
            description,
            thumbNail: thumbnailDetails.secure_url,
            instructor: instructorDetails._id,
            price,
            tags,
            category
        });

        // Corrected method name from findByIdandUpdate to findByIdAndUpdate
        await User.findByIdAndUpdate(instructorDetails._id, {
            $push: { courses: newCourse._id }
        }, { new: true });

        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: { courses: newCourse._id } // Corrected field name from course to courses
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Error in creating the course"
        });
    }
};



exports.getAllCourses = async (req, res) => {
    try {
        console.log("Getting all courses")
        const allCourses = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnroled: true,
            }
        )
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        });
    }
};

//get course details
exports.getCourseDetails = async (req, res) => {
    try {
        console.log("Getting Course Details")
        const { courseId } = req.body;
        const courseDetails = await Course.find({courseId}).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                }
            )
            .exec();
        console.log("fetched the data")
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not find course with ID ${courseId}`
            })
        }
        return res.status(200).json({
            success: true,
            message: "fetched all the details successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "error while fetching details "
        })
    }
}