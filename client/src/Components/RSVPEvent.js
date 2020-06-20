import React, {Component} from 'react';
import data from '../res/Data.js';
import '../css/RSVPEvent.css'

export default class RSVPEvent extends Component{
    // props includes current invited event we're dealing with
    // pulls data using event name and 

    state = {
        event:{},
        errorMessage: ""
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        for (var i = 0; i < data.events.length; i++){
            if (data.events[i].name === this.props.event){
                this.setState({event:data.events[i]});
            }
        }
    }


    // Selection handler for checkbox radio buttons, no longer used, using radio buttons now
    selectedChoice(selected) {
        var target = selected.target;
        var values = document.querySelectorAll(`[data-eventname="${this.state.event.name}"]`);
        if (target.classList.contains("selectedResponse")){
            target.classList.remove("selectedResponse")
            return;
        }
        values.forEach((value, key) => {
            value.classList.remove("selectedResponse")
        })
        target.classList.add("selectedResponse")
    }

    render(){
        return(
            <div key={this.props.iteration} className="rsvpEvent">
                <h2 className="rsvpHeadings">{this.state.event.name}</h2>
                <div className="rsvpStatusContainer">
                    <p className="errorMessage">{this.state.errorMessage}</p>
                    <div className="rsvpLeft">
                            <div>
                                {this.state.event.day} <br />
                                {this.state.event.date} <br />
                                {this.state.event.year}
                            </div>
                            <br />
                            <div className="attending">Attending:</div>
                    </div>
                    <div className="rsvpRight">
                            <div>{this.state.event.location}</div>
                            <div>
                                {this.state.event.address} <br />
                                {this.state.event.city} <br />
                            </div>
                            
			    <input type="radio" name={this.props.event} value="yes" />Yes
			    <input type="radio" name={this.props.event} value="no" />No



                            {/* 
                              * .eventResponse uses {this.props.event} because setting state and assigning value to data-eventname was taking too much time
                              * Need quick assignment in order to access item from RSVP View in order to pre-populate data
                              
		
		 * No longer used, this is for checkmark boxes, switched to radio buttons
                            <div className="eventResponse" data-eventname={this.props.event}>
                                <div className="selection" data-eventname={this.state.event.name} data-value="yes" onClick={(item) => this.selectedChoice(item)}>&nbsp;</div><p>Yes</p>
                                <div className="selection" data-eventname={this.state.event.name} data-value="no" onClick={(item) => this.selectedChoice(item)}>&nbsp;</div><p>No</p>
                            </div>
                  
		  */
			    }
		    </div>
                </div>
            </div>
        )
    }
}
