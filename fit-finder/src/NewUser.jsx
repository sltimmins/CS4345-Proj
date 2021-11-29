import React from 'react';
import './NewUser.css'

export class NewUser extends React.Component {

    constructor() {
        super();
        this.state = {
            userName: "",
            typeOfInput:"",
            measurementDimensions:"",
            chestSize:"",
            armLength:"",
            referenceBrand:"",
            referenceSizeTop:"",
            referenceSizeBottom:"",
        }
    }
    referenceBrands = [
        " ",
        "Amazon",
        "H&M",
        "Nike",
        "Another brand"
    ]

    referenceSizes=[
        " ",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
    ]

    submitButton(){
        const {
            userName,
            measurementDimensions,
            chestSize,
            armLength,
            referenceBrand,
            referenceSizeTop,
            referenceSizeBottom,
            password,
        } = this.state;
        this.props.saveNewPrefs({
            userName,
            measurementDimensions,
            chestSize,
            armLength,
            referenceBrand,
            referenceSizeTop,
            referenceSizeBottom,
            password,
        });
    }

    render(){return<>
        <section className={"centeringDiv"}>
            <h2 className={"subHeader instructions"}>Let's set up your clothing preferences!</h2>
        </section>
        <form>
            <label for="userName" className={"nameLabel"}>Enter your name: </label>
            <input 
                type="text" id="userName" name="userName"
                value={this.state.userName}
                onChange={event => this.setState({userName: event.target.value})}
                className="mb-2"
            >
            </input>

            <br/>

            
            {
                this.state.typeOfInput==="" && <div className="">
                    <button className="btn btn-block btn-primary col mx-3 customButton"
                            type="button"
                            onClick={ () => {if(this.state.userName)this.setState({ typeOfInput: "Measurements" }) }}>I know my measurements</button>
    
                    <button className="btn btn-block btn-outline-primary col mx-3"
                            type="button"
                            onClick={ () => {if(this.state.userName)this.setState({ typeOfInput: "RefSize" }) }}>I'll select a reference size</button>

                </div>

            }

            {
                this.state.typeOfInput==="Measurements" && <div>

                    <form>
                        <section className={"centeringDiv"}>
                            <h2 className={"directions instructions"}>Please enter your measurements below!</h2>
                        </section>

                        <label for="measurementDimensions" className={"nameLabel"}>These measurements are in </label>
                        <select className="ml-3" name="measurementDimensions" id="measurementDimensions"
                                onChange={event => this.setState({measurementDimensions: event.target.value})}>
                            <option value=""> </option>
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>

                        <br/>
                        <section className={"centeringDiv"}>
                            <div className="card mt-3 specialCard">

                                <h3 className="card-header mb-3 cardTitle">Shirts and Jackets</h3>
                                <div className="row pr-5">
                                    <label htmlFor="chestSize"
                                           className="col-5">Chest</label>
                                    <input
                                        type="text" id="chestSize" name="chestSize"
                                        value={this.state.chestSize}
                                        onChange={event => this.setState({chestSize: event.target.value})}
                                        className="mb-1 col-5 align-left"
                                    >
                                    </input>
                                </div>

                                <br/>

                                <div className="row">
                                    <label htmlFor="chestSize"
                                           className="col-5">Arm Length</label>
                                    <input
                                        type="text" id="armLength" name="armLength"
                                        value={this.state.armLength}
                                        onChange={event => this.setState({armLength: event.target.value})}
                                        className="mb-1 col-5"
                                    >
                                    </input>
                                </div>
                            </div>
                        </section>
                        
                    </form>

                </div>
            }
            {
                this.state.typeOfInput==="RefSize" && <div>

                    <div className="card">
                        <h2 className="card-header">Please select a clothing brand:</h2>

                        <select
                            name="referenceBrand" id="referenceBrand"
                            value={this.state.referenceBrand}
                            onChange={event => this.setState({ referenceBrand: event.target.value })}
                            className="custom-select custom-select-lg w-75 mx-auto">
                        {
                            this.referenceBrands.map((x, i) =>
                                <option key = {i} > {x}</option>)
                        }
                        </select>
                        
                        <br/>

                        <div className="row pr-5">
                            <label for="referenceSizeTop"
                                    className="col-5">Top Size:</label>
                            <select
                                name="referenceSizeTop" id="referenceSizeTop"
                                value={this.state.referenceSizeTop}
                                onChange={event => this.setState({ referenceSizeTop: event.target.value })}
                                className="mb-1 col-5 align-left">
                                {
                                    this.referenceSizes.map((x, i) =>
                                        <option key = {i} > {x}</option>)
                                }
                            </select>
                        </div>
                        <br/>
                        <div className="row pr-5">
                            <label for="referenceSizeBottom"
                                    className="col-5">Bottom Size:</label>
                            <select
                                name="referenceSizeBottom" id="referenceSizeBottom"
                                value={this.state.referenceSizeBottom}
                                onChange={event => this.setState({ referenceSizeBottom: event.target.value })}
                                className="mb-1 col-5 align-left">
                                {
                                    this.referenceSizes.map((x, i) =>
                                        <option key = {i} > {x}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
            }
            {
                (this.state.chestSize && this.state.armLength && this.state.measurementDimensions && this.state.userName) || (this.state.referenceSizeTop && this.state.referenceSizeBottom && this.state.referenceBrand) ?
                <button onClick={() => this.submitButton()}
                        className="btn btn-primary mt-3 padBottomButton"
                >Let's get started!</button>
                    : []
            }

        </form>

    </>}
}