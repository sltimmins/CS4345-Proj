import React from 'react';
import { useState } from 'react';
import { UserRepository } from './api/UserRepository';
import { LandingPage } from './LandingPage';
 
export const Login = props => {
    
    const userRepo = new UserRepository();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false)

    const login = () => {
        userRepo.login(username, password).then(x => {
            if(x.success) {
                window.localStorage.setItem("userID", JSON.stringify(x.data.id));
                window.localStorage.setItem("userName", JSON.stringify(x.data.username));
                window.localStorage.setItem("measurementDimensions", JSON.stringify(x.data.measurementDimensions));
                window.localStorage.setItem("height", JSON.stringify(x.data.height));
                window.localStorage.setItem("chestSize", JSON.stringify(x.data.chest));
                window.localStorage.setItem("sleeveLength", JSON.stringify(x.data.sleeveLength));
                window.localStorage.setItem("neckSize", JSON.stringify(x.data.neck));
                window.localStorage.setItem("hasAccount", JSON.stringify("true"));
                window.location.reload(true);
            } else {
                window.alert("Incorrect user or password");
            }
        })
    }

    return<>
        <div className="card">
        <h1 className="card-header w-100 text-center mx-auto">Login</h1>
        <div className="card-body">
            <form id="registerForm" className="card-body text-center">
                <label for="userName">Username: </label>
                <input
                    type="text" id="userName" name="userName"
                    className="mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}                    >
                </input>

                <br />

                <label for="password">Password: </label>
                <input
                    type="password" id="password" name="password"
                    value={password}
                    className="mb-3"
                    onChange={(e) => setPassword(e.target.value)}
                >
                </input>

                <br />

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => login()}>Log in</button>
            </form>
        </div>
        </div>
    </>
}
