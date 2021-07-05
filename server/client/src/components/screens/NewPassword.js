import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

function NewPassword() {
    const History = useHistory();
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const PostData = () => {
        //eslint-disable-next-line
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            M.toast({html : "Password must contain 6 characters, atleast one uppercase, lowercase, number and special character", classes : "#c62828 red darken-3"});
            return;
        }
        fetch("/new-password", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                password : password,
                token : token
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
                    type = "password"
                    placeholder = "Enter a new Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => PostData()}>Set Password</button>
            </div>
        </div>
    );
}

export default NewPassword;
