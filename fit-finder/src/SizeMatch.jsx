import React, { useState } from "react";

import {findMySize} from './algorithm/FindSize.js';

export const SizeMatch = props => {

    // /* eslint-disable no-undef */
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     url = tabs[0].url;
    // });

    const [currentSite, setCurrentSite] = useState(undefined);
    const [userSize, setUserSize] = useState(undefined);

    let selectWebsite = event => {
        let value = event.target.value;
        setCurrentSite(value);
        setUserSize(findMySize({value}));
    }

    return <> 
    
        <div>
            <label className="mr-3">I'm shopping on </label><span> </span>
            <select className="ml-5" name="currentWebsite" id="currentWebsite"
                    onChange={(e) => selectWebsite(e)}>
                <option value=""> </option>
                <option value="Amazon">Amazon</option>
                <option value="Nike">Nike</option>
            </select>
        </div>

        <h2>Your preferred size for is:</h2>
        <h2>{userSize}</h2>
    
    </>

}