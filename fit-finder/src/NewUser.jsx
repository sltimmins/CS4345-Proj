import React from 'react';

export class NewUser extends React.Component {

    state = {
        userName: "",
        typeOfInput:""
    }

    submitButton(){
        this.props.saveUserPrefs({
            userName: this.state.userName,
        });
    }

    render(){return<>

        <h2>Let's set up your clothing preferences!</h2>

        <form>
            <label for="userName">Enter your name: </label>
                <input 
                    type="text" id="userName" name="userName"
                    value={this.state.userName}
                    onChange={event => this.setState({userName: event.target.value})}
                >
                </input>

            
            {
                this.state.typeOfInput==="" && <div>
                    <button type="button"
                            onClick={ () => this.setState({ typeOfInput: "Measurements" }) }>I know my measurements</button>
    
                    <button type="button"
                            onClick={ () => this.setState({ typeOfInput: "RefSize" }) }>I'll select a reference size</button>

                </div>

            }

            {
                this.state.typeOfInput==="Measurements" && <div>
                    <h2>Please enter your measurements:</h2>
                </div>
            }
            {
                this.state.typeOfInput==="RefSize" && <div>
                    <h2>Please select a clothing brand:</h2>
                    <select></select>
                </div>
            }

        </form>

        <button type="button"
            onClick={ () => this.submitButton() }>Let's get started!</button>

    </>}
}