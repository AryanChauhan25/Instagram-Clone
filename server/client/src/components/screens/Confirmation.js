import React from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

function Confirmation() {
    const History = useHistory();
    const PostData = (token) => {
        fetch(`/confirmation/${token}`, {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => {
            M.toast({html : data.Message, classes : "#388e3c green darken-1"});
        History.push("/login");
        })
        .catch((err) => console.log(err));
    }
    return (
        <div className = "Login">
            <div className = "Login__Card card">
                <h2>Instagram</h2>
                <button className = "btn waves-effect waves-light #64b5f6 blue darken-1 login_button" onClick = {() => PostData(window.location.pathname.substr(14))}>Verify Email</button>
            </div>
        </div>
    );
}

export default Confirmation;
