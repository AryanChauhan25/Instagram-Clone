import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

function CreatePost() {
    const History = useHistory();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [secure_url, setUrl] = useState("");
    useEffect(() => {
        if(secure_url) {
            fetch("/create", {
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                    title : title,
                    description : description,
                    picture : secure_url
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.Error) {
                    M.toast({html : data.Error, classes : "#c62828 red darken-3"});
                }
                else {
                    M.toast({html : "Successfully posted.", classes : "#388e3c green darken-1"});
                    History.push("/");
                }
            })
            .catch((err) => console.log(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secure_url]);
    const PostDetails = () => {
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
    return (
        <div className = "CreatePost card input-field">
            <input
                type = "text"
                placeholder = "Title"
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
            />
            <input
                type = "text"
                placeholder = "Description"
                value = {description}
                onChange = {(e) => setDescription(e.target.value)}
            />
            <div className = "file-field input-field">
                <div className = "btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type = "file" onChange = {(e) => setImage(e.target.files[0])} />
                </div>
                <div className = "file-path-wrapper">
                    <input className = "file-path validate" type = "text" />
                </div>
            </div>
            <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => PostDetails()}>Post</button>
        </div>
    );
}

export default CreatePost;
