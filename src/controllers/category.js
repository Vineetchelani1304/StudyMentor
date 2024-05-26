const category = require('../models/category.model');


exports.Createcategory = async (req,res)=>{
    try {
        console.log("hello  category")
        const {title, description } = req.body
        if(!title || !description){
            return res.status(401).json({
                success: false,
                message: 'enter details'
            });

        }
        const CategoryDetails = await category.create({title:title, description:description})
        return res.status(200).json({
            success : true,
            message: 'category created successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error creating category'
        })
    }
}

exports.getAllCategory = async (req,res) => {
    try{
        const getAllCategory = await category.find({},{name : true},{description:true});

        return res.status(200).json({
            success : true,
            data : getAllCategory,
            
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message: 'error fetching category'
        })
    }
}


exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            //get coursesfor different categories
            const differentCategories = await category.find({
                                         _id: {$ne: categoryId},
                                         })
                                         .populate("courses")
                                         .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}