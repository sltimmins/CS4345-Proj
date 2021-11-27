import React from 'react';
import { NewUser } from './NewUser';
import { Login } from './Login';

import './LandingPage.css'
import LogoutIcon from '@mui/icons-material/Logout';
export class LandingPage extends React.Component {

    state = {
        hasAccount: JSON.parse(window.localStorage.getItem('hasAccount')) || "false",
        userName: JSON.parse(window.localStorage.getItem('userName')) || "",
        measurementDimensions: JSON.parse(window.localStorage.getItem('measurementDimensions')) || "",
        chestSize: JSON.parse(window.localStorage.getItem('chestSize')) || "",
        armLength: JSON.parse(window.localStorage.getItem('armLength')) || "",
        referenceBrand:JSON.parse(window.localStorage.getItem('referenceBrand')) || "",
        referenceSizeTop:JSON.parse(window.localStorage.getItem('referenceSizeTop')) || "",
        referenceSizeBottom:JSON.parse(window.localStorage.getItem('referenceSizeBottom')) || "",
    }

    saveNewPrefs(prefs){
        window.localStorage.setItem('hasAccount', JSON.stringify("true"));
        window.localStorage.setItem('userName', JSON.stringify(prefs.userName));
        window.localStorage.setItem('measurementDimensions', JSON.stringify(prefs.measurementDimensions));
        window.localStorage.setItem('chestSize', JSON.stringify(prefs.chestSize));
        window.localStorage.setItem('armLength', JSON.stringify(prefs.armLength));
        window.localStorage.setItem('referenceBrand', JSON.stringify(prefs.referenceBrand));
        window.localStorage.setItem('referenceSizeTop', JSON.stringify(prefs.referenceSizeTop));
        window.localStorage.setItem('referenceSizeBottom', JSON.stringify(prefs.referenceSizeBottom));
    }

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
            this.state.hasAccount === "false" && <div>

            <h1 className={"title"}>Welcome to FitFinder!</h1>
            <NewUser saveNewPrefs={prefs => this.saveNewPrefs(prefs)}/>

            </div>
        }

        {
            this.state.hasAccount === "true" && <div>
                <h1 className={"welcomeBack"}> Welcome back <span className={"welcomeBackName"}>{this.state.userName}</span>!</h1>

                <span className={"generalInfo"}> Your chest size is <span className={"dynamicData"}>{this.state.chestSize}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your arm length size is <span className={"dynamicData"}>{this.state.armLength}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your reference brand is <span className={"dynamicData"}>{this.state.referenceBrand}</span> </span><br/>
                <span className={"generalInfo"}> You prefer a size <span className={"dynamicData"}>{this.state.referenceSizeTop}</span> for tops and size <span className={"dynamicData"}>{this.state.referenceSizeBottom}</span> for bottoms </span><br/>

                </div>
        }

    </main>}
}