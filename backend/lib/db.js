const mongoose = require('mongoose');
require('dotenv').config();

const databaseConnect = ()=>{
    try{
        const uri = process.env.MONGO_URI;
        mongoose.connect(process.env.MONGO_URI);
        if(uri!= undefined){
            console.log("connected to database");
        }
    }catch(err){
        console.error('database connection failed',err)
    }
}

module.exports = databaseConnect