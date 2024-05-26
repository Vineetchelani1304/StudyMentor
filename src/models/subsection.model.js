const mongoose = require('mongoose');

const subsection = new mongoose.Schema({
    title : {
        type : 'string',
        required : true
    },
    timeDuration : {
        type : 'string',
        required : true,
    },
    description : {
        type : 'string',
        required : true,
    },
    videoUrl : {
        type : 'string',
        required : true,
    },


})

module.exports = mongoose.model('SubSection',subsection);