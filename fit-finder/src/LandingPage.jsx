import React from 'react';
import { NewUser } from './NewUser';

export class LandingPage extends React.Component {

    state = {
        hasAccount: JSON.parse(window.localStorage.getItem('hasAccount')) || "false"
    }

    getStarted(input){
        window.localStorage.setItem('hasAccount', JSON.stringify(input));
    }

    render(){return<>

        <button onClick={ () => window.localStorage.clear()}>CLEAR LOCAL STORAGE</button>

        <h1>Welcome to FitFinder!</h1>

        {this.state.hasAccount === "false" && <div>

            <NewUser/>
            
            <button onClick={ () => this.getStarted("true")}>Get Started!</button>

        </div>}

        {
            this.state.hasAccount === "true" && <h1>Previous</h1>
        }

    </>}
}