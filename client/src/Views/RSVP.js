import React, {Component} from 'react';
import RSVPEvent from '../Components/RSVPEvent.js';

export default class RSVP extends Component{

    invitedEvents = JSON.parse(sessionStorage.getItem('invitedEvents'));

    componentDidMount(){
        this.prePopulateRadioSelections();
    }

    prePopulateRadioSelections(){
        // All selections are empty if this is the first time website is being accessed
        if (JSON.parse(sessionStorage.getItem("dateSubmitted")) === "" && sessionStorage.getItem("setRSVPEvents") === null) return;
        
	var eventsAttending = JSON.parse(sessionStorage.getItem("eventsAttending"));
	var eventResponses = document.querySelectorAll("input[type='radio']");
	Array.prototype.map.call(eventResponses, (eventResponse) => {
	    if (eventsAttending.includes(eventResponse.name) && eventResponse.value === "yes") eventResponse.checked = true;
	    else if (!eventsAttending.includes(eventResponse.name) && eventResponse.value === "no") eventResponse.checked = true;
	})
    }


    // populates check box selection values, no longer used, switched to radio buttons
    prePopulateCheckBoxSelections(){
        // All selections are empty if this is the first time website is being accessed
        if (JSON.parse(sessionStorage.getItem("dateSubmitted")) === "" && sessionStorage.getItem("setRSVPEvents") === null) return;

        var eventsAttending = JSON.parse(sessionStorage.getItem("eventsAttending"))
        var eventResponses = document.querySelectorAll(".eventResponse")
        Array.prototype.map.call(eventResponses, (eventResponse) => {
            var eventName = eventResponse.dataset.eventname;
            var options = eventResponse.getElementsByClassName('selection');
            if (eventsAttending.includes(eventName)){

                // Checks to see which events were previously marked as "attending" in database and marks on website accordingly 
                // eslint-disable-next-line
                (options[0].dataset.value === "yes") 
                    ? options[0].classList.add('selectedResponse')
                    : options[1].classList.add('selectedResponse')
            }
            else options[1].classList.add('selectedResponse')
        })
    }


    render(){
        return(
            <div>
                {this.invitedEvents.map((event, key) => ([
                    <RSVPEvent key={key} iteration={key} event={event} numberEvents={this.invitedEvents.length}/>,
                    (key < this.invitedEvents.length - 1)
                        ? <hr key={key + "hr"}/>
                        : null
                    ]
                ))}
            </div>
        );

    }
}
