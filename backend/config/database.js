const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Database connected successfully.");
    }
    catch(err){
        console.error("error in connecting to MongoDB", err);
        process.exit(1);
    }
}

module.exports = connectDB;