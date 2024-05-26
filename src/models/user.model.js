const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstName :{
        type: 'string',
        required: true,
        trim : true
    },
    lastName :{
        type: 'string',
        required: true,
        trim : true
    },
    email :{
        type: 'string',
        required: true,
        trim : true
    },
    password :{
        type: 'string',
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    AccountType :{
        type : 'string',
        enum : ['admin','student','instructor'],
        required: true,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'profile',
        required: true
    },
    courses : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref : 'course',
        }
        
    ],
    image : {
        type : 'string',
        required: true
    },
    token : {
        type : 'string',
    },
    tokenExpiresIn : {
        type : Date,
    },


    coureprogress : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'courseProgress'
        }
    ]
},{
    timestamps:true,
})

module.exports = mongoose.model('User',userschema);

