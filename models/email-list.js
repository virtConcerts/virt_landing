const { string, required } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config()



mongoose.connect('mongodb+srv://Jacob_Shepherd:FW5bnmBdgxsR2du@virtconcerts1.5asbb.mongodb.net/landing', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN, mongo is working!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR WITH MONGO!!!!")
        console.log(err)
    })

const emailListSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    created: {
        type: Number,
        required: true
    },

    createdFormatted: {
        type: String,
        required: true
    }, 
})




const emailList = mongoose.model('emailList', emailListSchema)

module.exports = emailList

