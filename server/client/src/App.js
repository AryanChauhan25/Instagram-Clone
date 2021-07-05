import React, { createContext, useEffect, useReducer, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { Reducer, initialState } from './reducers/UserReducer';
import Header from './components/Header';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import FollowingPosts from './components/screens/FollowingPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import MyPosts from './components/screens/MyPosts';
import Confirmation from './components/screens/Confirmation';

export const UserContext = createContext();

const Routing = () => {
    const History = useHistory();
    const { dispatch } = useContext(UserContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user) {
            dispatch({ type : "USER", payload : user });
            const check = History.location.pathname.startsWith("/register") || History.location.pathname.startsWith("/reset-password") || History.location.pathname.startsWith("/login");
            if(check) {
                History.push("/");
            }
        } else {
            const check = History.location.pathname.startsWith("/register") || History.location.pathname.startsWith("/reset-password") || History.location.pathname.startsWith("/confirmation");
            if(History.location.pathname === "/confirmation" || !check) {
                History.push("/login");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <Switch>
            <Route path = "/register">
                <Register />
            </Route>
            <Route path = "/login">
                <Login />
            </Route>
            <Route exact path = "/confirmation/:token">
                <Confirmation />
            </Route>
            <Route exact path = "/profile">
                <Profile />
            </Route>
            <Route path = "/create">
                <CreatePost />
            </Route>
            <Route path = "/profile/:userid">
                <UserProfile />
            </Route>
            <Route path = "/followingposts">
                <FollowingPosts />
            </Route>
            <Route path = "/mypost">
                <MyPosts />
            </Route>
            <Route exact path = "/reset-password">
                <Reset />
            </Route>
            <Route path = "/reset-password/:token">
                <NewPassword />
            </Route>
            <Route exact path = "/">
                <Home />
            </Route>
        </Switch>
    );
}

function App() {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <UserContext.Provider value = {{state, dispatch}}>
            <Router>
                <Header />
                <Routing />
            </Router>
        </UserContext.Provider>
    );
}

export default App;
