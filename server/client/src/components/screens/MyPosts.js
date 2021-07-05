import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

function MyPosts() {
    const [data, setData] = useState([]);
    const { state } = useContext(UserContext);
    useEffect(() => {
        fetch("/mypost", {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((availablePosts) => {
            setData(availablePosts.posts);
        })
        .catch((err) => console.log(err));
    }, []);
    const likePost = (id) => {
        fetch("/like", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result;
                } else {
                    return item;
                }
            })
            setData(newData);
        })
        .catch((err) => console.log(err));
    }
    const unlikePost = (id) => {
        fetch("/unlike", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result;
                } else {
                    return item;
                }
            })
            setData(newData);
        })
        .catch((err) => console.log(err));
    }
    const commentPost = (text, postId) => {
        fetch("/comment", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                text : text,
                postId : postId
            })
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result;
                } else {
                    return item;
                }
            })
            setData(newData);
        })
        .catch((err) => console.log(err));
    }
    const deleteComment = (postid, commentid) => {
        fetch(`/deletecomment/${postid}/${commentid}`, {
          method: "delete",
          headers: {
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
          }
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {    
                if (item._id === result._id) {
                    return result;
                } else {
                    return item;
                }
            });
            setData(newData);
        });
    }
    const deletePost = (id) => {
        fetch(`/deletepost/${id}`, {
            method : "delete",
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.filter((item) => {
                return item._id !== result._id;
            })
            setData(newData);
        })
        .catch((err) => console.log(err));
    }
    return (
        <div className = "Home">
            {
                data.length === 0
                ? <h2 style = {{display : "flex", justifyContent : "center"}}>You have not created any post.</h2>
                : data.map((item) => {
                    return (
                        <div className = "Home__Card card" key = {item._id}>
                            <h5 style = {{fontWeight : "600", padding : "5px"}}>
                                <Link to = "/profile">{item.postedBy.name}</Link>
                                <i className = "material-icons likeIcon" style = {{float : "right"}} onClick = {() => deletePost(item._id)}>delete</i>
                            </h5>
                            <div className = "Home__CardImage card-image">
                                <img src = {item.image} alt = "postImage" />
                            </div>
                            <div className = "Home__CardInfo card-content">
                                <i className = "material-icons likes">favorite</i>
                                {
                                    item.likes.includes(state._id)
                                    ? <i className = "material-icons likeIcon" onClick = {() => unlikePost(item._id)}>thumb_down</i>
                                    : <i className = "material-icons likeIcon" onClick = {() => likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.description}</p>
                                {
                                    item.comments.map((record) => {
                                        return (
                                            <h6 key = {record._id}>
                                                <span style = {{fontWeight : "600"}}><Link to = {record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"}>{record.postedBy.name}</Link></span> {record.text}
                                                {(record.postedBy._id) === state._id && <i className = "material-icons likeIcon deleteComment" onClick = {() => deleteComment(item._id, record._id)}>delete_outline</i>}
                                            </h6>
                                        );
                                    })
                                }
                                <form onSubmit = {(e) => {
                                    e.preventDefault();
                                    commentPost(e.target[0].value, item._id);
                                    e.target[0].value = "";
                                }}>
                                    <input
                                        type = "text"
                                        placeholder = "Add a comment..."
                                    />
                                </form>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default MyPosts;
