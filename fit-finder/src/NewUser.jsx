import React from 'react';

export class NewUser extends React.Component {

    state = {
        userName: "",
        
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

            <button type="button"
                onClick={ () => this.submitButton() }>Let's get started!</button>
        </form>

    </>}
}