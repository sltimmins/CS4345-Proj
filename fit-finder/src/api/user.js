import axios from "axios";
import {BACKEND_USERS_URL} from "../constants/constants";

export const getUser = async (user) => {
    let payload = null;
    await axios.post(BACKEND_USERS_URL + '/login', user)
    .then(responseJson => {
            if(responseJson.success){
                payload = responseJson
            }
        }
    ) .catch (e => console.log(e))
    return payload;
}