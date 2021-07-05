const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const PostsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    likes : [{
        type : ObjectId,
        ref : "User"
    }],
    comments : [{
        text : {
            type : String,
        },
        postedBy : {
            type : ObjectId,
            ref : "User"
        }
    }],
    postedBy : {
        type : ObjectId,
        ref : "User"
    }
}, {timestamps : true});

mongoose.model("Posts", PostsSchema);