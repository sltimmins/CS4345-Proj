import React, { useState } from "react";

import {findMySize} from './algorithm/FindSize.js';

export const SizeMatch = props => {

    const [currentSite, setCurrentSite] = useState(undefined);
    const [fitPref, setFitPref] = useState(undefined);
    const [userSize, setUserSize] = useState(undefined);

    let selectWebsite = event => {
        let value = event.target.value;
        setCurrentSite(value);
        setUserSize(findMySize( {value}, "Standard"));
    }

    let changeFitPref = event => {
        let value = event.target.value;
        setFitPref(value);
        setUserSize(findMySize(currentSite, {value}));
    }

    return <> 
    
        <div>
            <label className={"mr-3 shoppingOn"}>I'm shopping on </label><span> </span>
            <select className="ml-5" name="currentWebsite" id="currentWebsite"
                    onChange={(e) => selectWebsite(e)}>
                <option value=""> </option>
                <option value="Amazon">Amazon</option>
                <option value="Nike">Nike</option>
            </select>
        </div>

        {
            currentSite && <div className={'center'}>
                <h2 className={'prompt'}>Your preferred size for {currentSite} is:</h2>
                <h1>{userSize}</h1>
            </div>
        }

        <label className="mr-3">I prefer my clothes</label><span> </span>
            <select className="ml-5" name="prefSize" id="prefSize"
                    onChange={(e) => changeFitPref(e)}>
                <option value="Standard">Standard sized</option>
                <option value="Looser">Loose-fitting</option>
                <option value="Tigher">Tighter-fitting</option>
            </select>
    </>

}