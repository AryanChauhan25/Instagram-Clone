import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import M from 'materialize-css';
import './Profile.css';

function Profile() {
    const [myPosts, setPosts] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    useEffect(() => {
        fetch("/myposts", {
            method : "get",
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setPosts(result.userPosts);
        })
        .catch((err) => console.log(err));
    }, []);
    useEffect(() => {
        fetch("/updatedprofile", {
            method : "get",
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            dispatch({
                type : "UPDATE_PROFILE",
                payload : {
                    followers : result.followers,
                    following : result.following
                }
            })
            localStorage.setItem("user", JSON.stringify(result));
        })
        .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(image) {
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
                fetch("/updatepic", {
                    method : "put",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body : JSON.stringify({
                        image : data.secure_url
                    })
                })
                .then((res) => res.json())
                .then((result) => {
                    console.log(result);
                    localStorage.setItem("user", JSON.stringify({...state, image : result.image}));
                    dispatch({
                        type : "UPDATEPIC",
                        payload : result.image
                    });
                    M.toast({html : "Successfully updated image", classes : "#388e3c green darken-1"});
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);
    const UpdateImage = (file) => {
        setImage(file);
    }
    return (
        <div className = "Profile">
            <div className = "Profile__Sub">
                <div className = "Profile__Details">
                    <div>
                        <img
                            className = "Profile__DetailsImage"
                            src = {state ? state.image : "Loading"}
                            alt = "profileImage"
                        />
                    </div>
                    <div className = "Profile__DetailsInfo">
                        <h4>{state ? state.name : "Loading"}</h4>
                        <h4>{state ? state.email : "Loading"}</h4>
                        <div className = "Profile__DetailsInfo1">
                            <h6>{myPosts.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className = "file-field input-field Profile__Update">
                    <div className = "btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type = "file" onChange = {(e) => UpdateImage(e.target.files[0])} />
                    </div>
                    <div className = "file-path-wrapper">
                        <input className = "file-path validate" type = "text" placeholder = "Profile Picture" />
                    </div>
                </div>
            </div>
            <div className = "Profile__Posts">
                {
                    myPosts.map((item) => {
                        return (
                            <img
                                className = "Profile__PostsImages"
                                src = {item.image}
                                alt = {item.title}
                                key = {item._id}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Profile;
