const mongoose = require('mongoose');

const category = new mongoose.Schema({
    title :{
        type : 'string',
        required: true,
    },
    description : {
        type : 'string',
        required: true,
    },
    course : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
    }]
})

module.exports = mongoose.model('category',category);