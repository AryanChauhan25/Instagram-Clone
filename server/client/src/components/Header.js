import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

function Header() {
    const searchModal = useRef(null);
    const History = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [userDetails, setDetails] = useState([]);
    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);
    const renderList = () => {
        if(state) {
            return [
                <li key = "1"><i data-target="modal1" className = "large material-icons modal-trigger likeIcon" style = {{color : "black"}}>search</i></li>,
                <li key = "2"><Link to = "/profile">Profile</Link></li>,
                <li key = "3"><Link to = "/create">Create Post</Link></li>,
                <li key = "4"><Link to = "/followingposts">Following Posts</Link></li>,
                <li key = "5"><Link to = "/mypost">My Posts</Link></li>,
                <li key = "6">
                    <button
                        className = "btn waves-effect waves-light #c62828 red darken-3"
                        onClick = {() => {
                            localStorage.clear();
                            dispatch({ type : "CLEAR" });
                            M.toast({html : "Successfully logged out.", classes : "#388e3c green darken-1"});
                            History.push("/login");
                        }}
                    >
                        Log Out
                    </button>
                </li>
            ]
        } else {
            return [
                <li key = "7"><Link to = "/login">SignIn</Link></li>,
                <li key = "8"><Link to = "/register">SignUp</Link></li>
            ]
        }
    }
    const fetchUsers = (query) => {
        setSearch(query);
        fetch("/search-users", {
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                query : query
            })
        })
        .then((res) => res.json())
        .then((result) => {
            setDetails(result.user);
        })
    }
    return (
        <nav className = "Header">
            <div className = "nav-wrapper white">
                <Link to = {state ? "/" : "/login"} className = "brand-logo left">Instagram</Link>
                <ul id = "nav-mobile" className = "right">
                    {renderList()}
                </ul>
            </div>
            <div id = "modal1" className = "modal" ref = {searchModal} style = {{color : "black"}}>
                <div className = "modal-content">
                    <input
                        type = "text"
                        placeholder = "Search users"
                        value = {search}
                        onChange = {(e) => fetchUsers(e.target.value)}
                    />
                    <ul className = "collection">
                        {
                            userDetails.map((item) => {
                                return (
                                    <Link
                                        to = {state && (item._id !== state._id ? "/profile/" + item._id : "/profile")}
                                        onClick = {() => {
                                            M.Modal.getInstance(searchModal.current).close();
                                            setSearch("");
                                        }}
                                        key = {item._id}
                                    >
                                        <li key = {item._id} className = "collection-item">{item.email}</li>
                                    </Link>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className = "modal-footer">
                    <button className = "modal-close waves-effect waves-green btn-flat" onClick = {() => setSearch("")}>Close</button>
                </div>
            </div>
        </nav>
    );
}

export default Header;
