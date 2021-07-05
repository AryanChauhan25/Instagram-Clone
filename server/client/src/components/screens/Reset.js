import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

function Reset() {
    const History = useHistory();
    const [email, setEmail] = useState("");
    const PostData = () => {
        //eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html : "Invalid Email", classes : "#c62828 red darken-3"});
            return;
        }
        fetch("/reset-password", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                email : email
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.Error) {
                M.toast({html : data.Error, classes : "#c62828 red darken-3"});
            }
            else {
                M.toast({html : data.Message, classes : "#388e3c green darken-1"});
                History.push("/login");
            }
        })
        .catch((err) => console.log(err));
    }
    return (
        <div className = "Login">
            <div className = "Login__Card card">
                <h2>Instagram</h2>
                <input
                    type = "text"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => PostData()}>Reset Password</button>
            </div>
        </div>
    );
}

export default Reset;
