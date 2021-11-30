import React from 'react';
import { NewUser } from './NewUser';
import { Login } from './Login';
import './LandingPage.css'
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios'
import {BACKEND_USERS_URL, getUserPostTransform} from "./constants/constants";
import {getUser} from "./api/user";
import { UserRepository } from './api/UserRepository';
import { SizeMatch } from './SizeMatch';

export class LandingPage extends React.Component {
    constructor() {
        super();
        this.state = {
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

            login: false,
            signup: false,
        }
    }

    componentDidMount = async() => {
        let user = this.getCacheUser();
        let payload = await getUser(user);
        if(payload) {
            let prefs = {};
            for(const prop of payload) {
                prefs[getUserPostTransform[prop]] = payload[prop];
            }
            this.saveNewPrefs(prefs);
        }
    }

    getCacheUser = () => {
        let user = null;
        if (window.localStorage.getItem('userName')) {
            user = {
                'username': window.localStorage.getItem('userName')
            }
        }
        if (window.localStorage.getItem('password')) {
            if(user) {
                user['password'] = window.localStorage.getItem('password');
            }
        }
        return user;
    }


    saveNewPrefs = (prefs) => {
        window.localStorage.setItem('hasAccount', JSON.stringify("true"));
        for(const property in prefs) {
            window.localStorage.setItem(property, JSON.stringify(prefs[property]));
        }
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
            this.state.hasAccount === "false" ?  
            <div className={'buttonHolder'}>

                <h1 className={"title"}>Welcome to FitFinder!</h1>
                <h2 className={"subHeader instructions wide"}>Log in or sign up below to find start finding accurate sizes! </h2>
    
                <button className="btn btn-block btn-primary col mx-3"
                        onClick={() => this.setState({signup: false, login: !this.state.login})}>Log In</button>
                <button className="btn btn-block btn-outline-primary col mx-3"
                    onClick={() => this.setState({login: false, signup: !this.state.signup})}>Sign Up</button>
                    {
                        this.state.login ? <Login didLogin={loginState => this.didLogin(loginState)}/> : []
                    }
                    {
                        this.state.signup ? <NewUser saveNewPrefs={prefs => this.saveNewPrefs(prefs)}/> : []
                    }
            </div> : []
        }

        {
            this.state.hasAccount === "true" && <div>
                <h1 className={"welcomeBack"}> Welcome back <span className={"welcomeBackName"}>{this.state.userName}</span>!</h1>

                <SizeMatch/>
                <br/><br/>

                <span className={"generalInfo"}> Your chest size is <span className={"dynamicData"}>{this.state.chestSize}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your arm length size is <span className={"dynamicData"}>{this.state.sleeveLength}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your neck size is <span className={"dynamicData"}>{this.state.neckSize}{this.state.measurementDimensions}</span> </span><br/>
                <span className={"generalInfo"}> Your hip size is <span className={"dynamicData"}>{this.state.hipSize}{this.state.measurementDimensions}</span> </span><br/>

                <span className={"generalInfo"}> Your reference brand is <span className={"dynamicData"}>{this.state.referenceBrand}</span> </span><br/>
                <span className={"generalInfo"}> You prefer a size <span className={"dynamicData"}>{this.state.referenceSizeTop}</span> for tops and size <span className={"dynamicData"}>{this.state.referenceSizeBottom}</span> for bottoms </span><br/>

                </div>
        }

        <br/>

    </main>}
}