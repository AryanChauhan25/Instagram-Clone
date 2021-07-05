const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const { JWT_SECRET, EMAIL, PASSWORD, LINK } = require("../config/keys");
const User = mongoose.model("User");
const ObjectId = require('mongoose').Types.ObjectId; 

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
});

router.post("/confirmation/:token", (req, res) => {
    User.findByIdAndUpdate({ _id : req.params.token }, { $set : { confirmed : true } })
    .then((user) => {
        return res.json({ Message : "User verified Successfully." });
    });
});

router.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;
    if(!name || !email || !password) {
        return res.status(422).json({ Error : "Please add all the fields." });
    }
    User.findOne({ email : email })
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({ Error : "User already exists with that email." });
        }
        bcryptjs.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                name : name,
                email : email,
                password : hashedPassword,
                image : image
            });
            user.save()
            .then((user) => {
                const token = user._id;
                const mailOptions = {
                    from: EMAIL,
                    to: user.email,
                    subject: "Verify your email.",
                    html: `<p>Your registration is successful.</p>
                        <h4>Click <a href = "${LINK}/confirmation/${token}">here</a> to verify your email.</h4>
                        <h5>Please don't reply to this mail.</h5>
                    `
                };
                transporter.sendMail(mailOptions, (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.status(422).json({ Error : "Invalid Email" });
                    }
                    else {
                        console.log("Email sent successfully!");
                    }
                });
                res.json({ Message : "User Saved Successfully!!" });
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(422).json({ Error : "Please fill all the details." });
    }
    User.findOne({ email : email })
    .then((savedUser) => {
        if(!savedUser) {
            return res.status(422).json({ Error : "Invalid email or password." });
        }
        if(!savedUser.confirmed) {
            return res.status(422).json({ Error : "Please verify your email to login." });
        }
        bcryptjs.compare(password, savedUser.password)
        .then((foundUser) => {
            if(!foundUser) {
                return res.status(422).json({ Error : "Invalid email or password." });
            } else {
                // res.json({ Message : "Successfully Sign In." });
                const token = jwt.sign({ _id : savedUser._id }, JWT_SECRET);
                const { _id, name, email, image, followers, following } = savedUser;
                return res.json({ Token : token, user : {_id, name, email, image, followers, following} });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post("/reset-password", (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
        } else {
            const token = buffer.toString("hex");
            User.findOne({ email : req.body.email })
            .then((user) => {
                if(!user) {
                    return res.status(422).json({ Error : "User don't exist with that email." });
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000;
                user.save()
                .then((result) => {
                    const mailOptions = {
                        from: EMAIL,
                        to: user.email,
                        subject: "Reset Password",
                        html: `
                            <p>Hey, ${user.name}! You requested for password reset.</p>
                            <h5>Click <a href = "${LINK}/reset-password/${token}">here</a> to reset your password.</h5>
                        `
                    };
                    transporter.sendMail(mailOptions, (err, result) => {
                        if((err)) {
                            console.log(err);
                            return res.json({ Error : err });
                        }
                        else {
                            console.log("Email sent successfully!!!");
                        }
                    });
                    return res.json({ Message : "Please check your email." });
                })
            })
        }
    })
});

router.post("/new-password", (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken : sentToken, expireToken : {$gt : Date.now()}})
    .then((user) => {
        if(!user) {
            return res.status(422).json({ Error : "Your password reset token has now expired." });
        }
        bcryptjs.hash(newPassword, 12)
        .then((hashedPassword) => {
            user.password = hashedPassword;
            user.expireToken = undefined;
            user.resetToken = undefined;
            user.save()
            .then((savedUser) => {
                return res.json({ Message : "Password updated successfully" });
            })
        })
    })
    .catch((err) => console.log(err));
});

module.exports = router;