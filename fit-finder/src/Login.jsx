import React from 'react';
import { useState } from 'react';

export const Login = props => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                    type="submit"
                    className="btn btn-primary">Log in</button>
            </form>
        </div>
        </div>

    </>
}
