import React from 'react';
import { NewUser } from './NewUser';

export class LandingPage extends React.Component {

    state = {
        hasAccount: JSON.parse(window.localStorage.getItem('hasAccount')) || "false",
        userName: JSON.parse(window.localStorage.getItem('userName')) || "",
    }

    saveNewPrefs(prefs){
        window.localStorage.setItem('hasAccount', JSON.stringify("true"));
        window.localStorage.setItem('userName', JSON.stringify(prefs.userName));
    }

    render(){return<>

        <button onClick={ () => window.localStorage.clear()}>CLEAR LOCAL STORAGE</button>

        <h1>Welcome to FitFinder!</h1>

        {this.state.hasAccount === "false" && <div>

            <NewUser saveUserPrefs={prefs => this.saveNewPrefs(prefs)}/>

        </div>}

        {
            this.state.hasAccount === "true" && <h1> Welcome back {this.state.userName}!</h1>
        }

    </>}
}