import { checkboxClasses } from '@mui/material';
import axios from 'axios';
const url = "http://ec2-18-217-252-234.us-east-2.compute.amazonaws.com:5000"

export class UserRepository {

    register(username, password, chest, height, hip, gender, sleeveLength, neck){
        return new Promise((resolve, reject) => {
          axios.post(`${url}/users/dimensions`, 
          {username: username, password: password,
            chest: chest, height: height, hip: hip, 
            gender: gender, sleeveLength: sleeveLength, neck: neck})
                .then(x => resolve(x.data))
                .catch(x => {
                    alert(x);
                    reject(x);
                })
        })
    }

    login(username, password){
        return new Promise((resolve, reject) => {
            axios.post(`${url}/login`, {username: username, password: password})
                  .then(x => resolve(x.data))
                  .catch(x => {
                      alert(x);
                      reject(x);
                  })
          })
    }
    /*
    return an object of the user that is currently logged
    */
    currentUser() {
        const user = sessionStorage.getItem('user');
        if (!user) return {};
        return JSON.parse(user);
    }

    /*
    Function returns a boolean indicating whether or not a user is logged in
    */
    loggedIn() {
        return Object.keys(this.currentUser()).length !== 0;
    }

}