import React from 'react';
import { NewUser } from './NewUser';

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

    render(){return<>

        <button onClick={ () => window.localStorage.clear()}>CLEAR LOCAL STORAGE</button> <br/>

        <img className="img-fluid float-center " src="ff_logo.png"></img>

        {this.state.hasAccount === "false" && <div>

            <h1>Welcome to FitFinder!</h1>
            <NewUser saveNewPrefs={prefs => this.saveNewPrefs(prefs)}/>

        </div>}

        {
            this.state.hasAccount === "true" && <div>
                <h1> Welcome back {this.state.userName}!</h1>

                <span> Your chest size is {this.state.chestSize}{this.state.measurementDimensions} </span><br/>
                <span> Your arm length size is {this.state.armLength}{this.state.measurementDimensions} </span><br/>
                <span> Your reference brand is {this.state.referenceBrand} </span><br/>
                <span> You prefer a size {this.state.referenceSizeTop} for tops and size {this.state.referenceSizeBottom} for bottoms </span><br/>

                </div>
        }

    </>}
}