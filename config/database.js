const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.connect = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log("Database connection Failed");
        console.log(err);
    });
}