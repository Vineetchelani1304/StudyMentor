const mongoose = require('mongoose')
require('dotenv').config();

exports.DbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log('Connected to database');
        })
        .catch(err => {
            console.log("error in connecting the database");
            console.error(err);
            process.exit(1);
        })
}