import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import './Profile.css';

function UserProfile() {
    const [userProfile, setProfile] = useState(null);
    const [showfollow, setShowfollow] = useState(true);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setProfile(result);
        })
        .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const followUser = () => {
        fetch("/follow", {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        })
        .then((res) => res.json())
        .then((result) => {
            dispatch({
                type : "UPDATE",
                payload : {
                    following : result.following,
                    followers : result.followers
                }
            });
            localStorage.setItem("user", JSON.stringify(result));
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : [
                            ...prevState.user.followers,
                            result._id
                        ]
                    }
                }
            })
            setShowfollow(false);
        })
        .catch((err) => console.log(err));
    }
    const unfollowUser = () => {
        fetch("/unfollow", {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                unfollowId : userid
            })
        })
        .then((res) => res.json())
        .then((result) => {
            dispatch({
                type : "UPDATE",
                payload : {
                    following : result.following,
                    followers : result.followers
                }
            });
            localStorage.setItem("user", JSON.stringify(result));
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter((item) => item !== result._id);
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : newFollower
                    }
                }
            });
            setShowfollow(true);
        })
        .catch((err) => console.log(err));
    }
    return (
        <>
            {
                userProfile ?
                <div className = "Profile">
                    <div className = "Profile__Sub Profile__Details">
                        <div>
                            <img
                                className = "Profile__DetailsImage"
                                src = {userProfile.user.image}
                                alt = "profileImage"
                            />
                        </div>
                        <div className = "Profile__DetailsInfo">
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className = "Profile__DetailsInfo1">
                                <h6 className = "userFollow">{userProfile.posts.length} posts</h6>
                                <h6 className = "userFollow">{userProfile.user.followers.length} followers</h6>
                                <h6 className = "userFollow">{userProfile.user.following.length} following</h6>
                                {
                                    showfollow && !userProfile.user.followers.includes(state._id)
                                    ? <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => followUser()}>Follow</button>
                                    : <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => unfollowUser()}>Unfollow</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className = "Profile__Posts">
                        {
                            userProfile.posts.map((item) => {
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
                : <h2>Loading.......</h2>
            }
        </>
    );
}

export default UserProfile;
