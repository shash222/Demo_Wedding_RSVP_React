import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import '../css/Confirmation.css';

export default class Confirmation extends Component{

    state = {
        secondsLeft: 3,
    }

    interval = "";

    componentDidMount(){
        this.interval = setInterval(() => {
            this.setState({secondsLeft: this.state.secondsLeft - 1})
            if (this.state.secondsLeft === 0) clearInterval(this.interval);
        }, 1000)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        return(
            <div>
                <p id="thankYou">THANK YOU!!!</p>
                <p id="eventReminder">An Event Reminder will be sent<br />closer to the day of the Ceremony!</p>
                <p>You will be taken to the event page in {this.state.secondsLeft} seconds</p>
                {this.state.secondsLeft === 0
                    ? <Redirect to='/EventInfo' />
                    : null}
            </div>
        );
    }
}