const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    confirmed : {
        type : Boolean,
        default : false
    },
    resetToken : String,
    expireToken : Date,
    image : {
        type : String,
        default : "https://res.cloudinary.com/leviluffyclone/image/upload/v1625100099/no_hn3skp.png"
    },
    followers : [{
        type : ObjectId,
        ref : "User"
    }],
    following : [{
        type : ObjectId,
        ref : "User"
    }]
});

mongoose.model("User", userSchema);