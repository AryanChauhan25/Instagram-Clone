const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Posts = mongoose.model("Posts");
const User = mongoose.model("User");

router.get("/allposts", requireLogin, (req, res) => {
    Posts.find()
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
        res.json({ posts : posts });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get("/followingposts", requireLogin, (req, res) => {
    Posts.find({ postedBy : {$in : req.user.following} })
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
        res.json({ posts : posts });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post("/create", requireLogin, (req, res) => {
    const { title, description, picture } = req.body;
    if(!title || !description || !picture) {
        return res.status(422).json({ Error : "Please add all the fields." });
    } 
    req.user.password = undefined;
    const post = new Posts({
        title : title,
        description : description,
        image : picture,
        postedBy : req.user
    });
    post.save()
    .then((result) => {
        res.json({ post : result });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
    Posts.find({ postedBy : req.user._id })
    .populate("postedBy", "_id name")
    .sort("-createdAt")
    .then((userPosts) => {
        res.json({ userPosts : userPosts});
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
    Posts.find({ postedBy : {$in : req.user} })
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
        res.json({ posts : posts });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get("/updatedprofile", requireLogin, (req, res) => {
    User.findOne({ _id : req.user._id })
    .select("-password")
    .then((user) => {
        res.json(user);
    })
    .catch((err) => console.log(err));
});

router.post("/like", requireLogin, (req, res) => {
    Posts.findByIdAndUpdate(req.body.postId, {
        $push : {likes : req.user._id}
    }, {
        new : true
    })
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ Error : err });
        } else {
            return res.json(result);
        }
    });
});

router.post("/unlike", requireLogin, (req, res) => {
    Posts.findByIdAndUpdate(req.body.postId, {
        $pull : {likes : req.user._id}
    }, {
        new : true
    })
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ Error : err });
        } else {
            return res.json(result);
        }
    });
});

router.post("/comment", requireLogin, (req, res) => {
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Posts.findByIdAndUpdate(req.body.postId, {
        $push : {comments : comment}
    }, {
        new : true
    })
    .populate("postedBy", "_id name")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ Error : err });
        } else {
            return res.json(result);
        }
    });
});

router.delete("/deletecomment/:id/:comment_id", requireLogin, (req, res) => {
    const comment = { _id : req.params.comment_id };
    Posts.findByIdAndUpdate(req.params.id, {
        $pull: { comments: comment },
    }, {
        new: true, 
    })
    .populate("postedBy", "_id name ")
    .populate("likes.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, postComment) => {
        if(err || !postComment) {
            return res.status(422).json({ Error: err });
        } else {   
            const result = postComment;
            res.json(result);
        }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Posts.findOne({ _id : req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post) {
            return res.status(422).json({ Error : err });
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => console.log(err));
        }
    })
});

module.exports = router;