import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

function Register() {
    const History = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [secure_url, setUrl] = useState(undefined);
    useEffect(() => {
        if(secure_url) {
            PostDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secure_url])
    const PostDetails = () => {
        //eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html : "Invalid Email", classes : "#c62828 red darken-3"});
            return;
        }
        //eslint-disable-next-line
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            M.toast({html : "Password must contain 6 characters, atleast one uppercase, lowercase, number and special character", classes : "#c62828 red darken-3"});
            return;
        }
        fetch("/register", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                name : name,
                email : email,
                password : password,
                image : secure_url
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.Error) {
                M.toast({html : data.Error, classes : "#c62828 red darken-3"});
            }
            else {
                M.toast({html : data.Message, classes : "#388e3c green darken-1"});
                // M.toast({html : "Check your Email for Verification", classes : "#388e3c green darken-1"});
                History.push("/login");
            }
        })
        .catch((err) => console.log(err));
    }
    const UploadImage = () => {
        M.toast({html : "Be patient! This will take some time...", classes : "#546e7a blue-grey darken-1"});
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "leviluffyclone");
        fetch("https://api.cloudinary.com/v1_1/leviluffyclone/image/upload", {
            method : "post",
            body : data
        })
        .then((res) => res.json())
        .then((data) => {
            setUrl(data.secure_url);
        })
        .catch((err) => console.log(err));
    }
    const PostData = () => {
        if(image) {
            UploadImage();
        } else {
            PostDetails();
        }
    }
    return (
        <div className = "Login">
            <div className = "Login__Card card">
                <h2>Instagram</h2>
                <input
                    type = "text"
                    placeholder = "Full Name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                />
                <input
                    type = "text"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <input
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <div className = "file-field input-field">
                    <div className = "btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type = "file" onChange = {(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className = "file-path-wrapper">
                        <input className = "file-path validate" type = "text" placeholder = "Profile Picture" />
                    </div>
                </div>
                <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => PostData()}>Sign up</button>
                <div>
                    <p>Have an account?
                        <Link to = "/login" className = "Login__RegisterButton"> Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
