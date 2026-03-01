const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodparnter"
    }
})

const foodModel = mongoose.model("foodItem",foodSchema)
module.exports = foodModel