import React from 'react';
import { NewUser } from './NewUser';
import { Login } from './Login';

import './LandingPage.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { UserRepository } from './api/UserRepository';
export class LandingPage extends React.Component {

    state = {
        hasAccount: JSON.parse(window.localStorage.getItem('hasAccount')) || "false",

        userName: JSON.parse(window.localStorage.getItem('userName')) || "",
        password: JSON.parse(window.localStorage.getItem('password')) || "",

        height: JSON.parse(window.localStorage.getItem('height')) || "",
        gender: JSON.parse(window.localStorage.getItem('gender')) || "",
        measurementDimensions: JSON.parse(window.localStorage.getItem('measurementDimensions')) || "",
        
        chestSize: JSON.parse(window.localStorage.getItem('chestSize')) || "",
        sleeveLength: JSON.parse(window.localStorage.getItem('sleeveLength')) || "",
        neckSize: JSON.parse(window.localStorage.getItem('neckSize')) || "",
        hipSize: JSON.parse(window.localStorage.getItem('hipSize')) || "",

        referenceBrand:JSON.parse(window.localStorage.getItem('referenceBrand')) || "",
        referenceSizeTop:JSON.parse(window.localStorage.getItem('referenceSizeTop')) || "",
        referenceSizeBottom:JSON.parse(window.localStorage.getItem('referenceSizeBottom')) || "",

        login: false
    }

    saveNewPrefs(prefs){
        window.localStorage.setItem('hasAccount', JSON.stringify("true"));

        window.localStorage.setItem('userName', JSON.stringify(prefs.userName));
        window.localStorage.setItem('password', JSON.stringify(prefs.password));

        window.localStorage.setItem('height', JSON.stringify(prefs.height));
        window.localStorage.setItem('gender', JSON.stringify(prefs.gender));
        window.localStorage.setItem('measurementDimensions', JSON.stringify(prefs.measurementDimensions));

        window.localStorage.setItem('chestSize', JSON.stringify(prefs.chestSize));
        window.localStorage.setItem('sleeveLength', JSON.stringify(prefs.sleeveLength));
        window.localStorage.setItem('neckSize', JSON.stringify(prefs.neckSize));
        window.localStorage.setItem('hipSize', JSON.stringify(prefs.hipSize));


        window.localStorage.setItem('referenceBrand', JSON.stringify(prefs.referenceBrand));
        window.localStorage.setItem('referenceSizeTop', JSON.stringify(prefs.referenceSizeTop));
        window.localStorage.setItem('referenceSizeBottom', JSON.stringify(prefs.referenceSizeBottom));
    }

    userRepo = new UserRepository();

    render(){return<main>
        <section className={"logoutSection"}>
            <button type={"button"} className={"logOutButton"} style={{display: this.state.hasAccount && this.state.hasAccount !== "false"  ? 'block': 'none'}}
                onClick={ () => {window.localStorage.clear(); this.setState({garbage: "garbage"}); window.location.href = "/"}}
            >
                <LogoutIcon fontSize={"large"}/>
            </button>
        </section>
        <img className="img-fluid float-center customImage " src="ff_logo.png"></img>

        {
            this.userRepo.loggedIn === true && this.setState({hasAccount: "true"})
        }

        {
            this.state.hasAccount === "false" && <div>

            <h1 className={"title"}>Welcome to FitFinder!</h1>
            <h2 className={"subHeader instructions"}>Let's set up your clothing preferences!</h2>

            <button className="btn btn-outline-secondary mb-3"
                    onClick={() => this.setState(prevState => ({login: !prevState.login}))}> or login here!</button>
            
            {
                this.state.login === true && <Login />
            }
            {
                this.state.login === false && <NewUser saveNewPrefs={prefs => this.saveNewPrefs(prefs)}/>
            }
            </div>
        }

        {
            this.state.hasAccount === "true" && <div>
                <h1 className={"welcomeBack"}> Welcome back <span className={"welcomeBackName"}>{this.state.userName}</span>!</h1>

                <span className={"generalInfo"}> Your chest size is <span className={"dynamicData"}>{this.state.chestSize}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your arm length size is <span className={"dynamicData"}>{this.state.sleeveLength}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your neck size is <span className={"dynamicData"}>{this.state.neckSize}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your hip size is <span className={"dynamicData"}>{this.state.hipSize}{this.state.measurementDimensions}</span> </span><br/>

                <span className={"generalInfo"}> Your reference brand is <span className={"dynamicData"}>{this.state.referenceBrand}</span> </span><br/>
                <span className={"generalInfo"}> You prefer a size <span className={"dynamicData"}>{this.state.referenceSizeTop}</span> for tops and size <span className={"dynamicData"}>{this.state.referenceSizeBottom}</span> for bottoms </span><br/>

                </div>
        }

    </main>}
}