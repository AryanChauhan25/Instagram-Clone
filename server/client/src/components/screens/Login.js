import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

function Login() {
    const { dispatch } = useContext(UserContext);
    const History = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const PostData = () => {
        //eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html : "Invalid Email", classes : "#c62828 red darken-3"});
            return;
        }
        fetch("/login", {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                email : email,
                password : password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.Error) {
                M.toast({html : data.Error, classes : "#c62828 red darken-3"});
            }
            else {
                localStorage.setItem("jwt", data.Token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type : "USER", payload : data.user});
                M.toast({html : "Successfully signed in.", classes : "#388e3c green darken-1"});
                History.push("/");
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
                <input
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <button className = "btn waves-effect waves-light #64b5f6 blue darken-1 login_button" onClick = {() => PostData()}>Log In</button>
                <p><Link to = "/reset-password"><span className = "Forget">Forgot Password?</span></Link></p>
                <div>
                    <p>Don't have an account?
                        <Link to = "/register" className = "Login__RegisterButton"> Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
