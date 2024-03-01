const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const db =  mongoose.connect(process.env.MONGODB_URI).then(()=>{ 
    console.log(' ⚡⚡⚡ Connected to database⚡⚡⚡ ');
}).catch((err)=>{
    console.log(err);
});

module.exports = db;