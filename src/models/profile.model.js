const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    gender : {
        type: 'string',
    },
    dateofBirth : {
        type : 'string',
    },
    contactNumber : {
        type : 'number',
        trim : true,
    },
    about : {
        type : 'string',
        trim : true,
    }
})

module.exports = mongoose.model('Profile',profileSchema);