const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Posts = mongoose.model("Posts");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id : req.params.id })
    .select("-password")
    .then((user) => {
        Posts.find({ postedBy : req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({ Error : err });
            }
            return res.json({ user, posts });
        })
    })
    .catch((err) => res.status(401).json({ Error : "User not found!" }));
})

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push : {followers : req.user._id}
    }, {
        new : true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({ Error : err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $push : {following : req.body.followId}
        }, {
            new : true
        })
        .select("-password")
        .then((result) => {
            res.json(result)
        })
        .catch((err) => res.status(422).json({ Error : err }));
    });
});

router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull : {followers : req.user._id}
    }, {
        new : true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({ Error : err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull : {following : req.body.unfollowId}
        }, {
            new : true
        })
        .select("-password")
        .then((result) => {
            res.json(result)
        })
        .catch((err) => res.status(422).json({ Error : err }));
    });
});

router.put("/updatepic", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set : {image : req.body.image}
    }, {
        new : true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({ Error : "Cannot Update Profile Picture." });
        }
        res.json(result);
    });
})

router.post("/search-users", (req, res) => {
    const userPattern = new RegExp("^" + req.body.query);
    User.find({ email : {$regex : userPattern} })
    .select("_id email")
    .then((user) => res.json({user : user}))
    .catch((err) => console.log(err));
});

module.exports = router;