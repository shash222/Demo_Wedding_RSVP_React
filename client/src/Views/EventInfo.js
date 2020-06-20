import React, {Component} from 'react';
import EventStatus from '../Components/EventStatus'
import '../css/EventInfo.css'

export default class EventInfo extends Component{

    // Hardcoded for now, pull from table when DB is set up
    invitedEvents = JSON.parse(sessionStorage.getItem('invitedEvents'));
    eventsAttending = JSON.parse(sessionStorage.getItem('eventsAttending'))
    numberAttending = JSON.parse(sessionStorage.getItem('numberAttending'))

    componentDidMount(){
        this.setEventStatus();
	    console.log("Mounted");
    }

    setEventStatus(){
        var eventStatuses = document.getElementsByClassName("eventAttendanceStatus")
	Array.prototype.map.call(eventStatuses, (event) => {
		console.log(event);
            if (this.eventsAttending.includes(event.dataset.eventname)) {
		event.classList.add("attendingEventStatus");
		event.classList.remove("notAttendingEventStatus");
                event.innerHTML = "Attending"
            }
            else {
                event.innerHTML = '<span class="notAttendingEventStatus">Not Attending</span><br /><span class="basedOnResponse">Based on RSVP<br />Response</span>'
            }
        })
    }

    getTableBody(eventName, key){
        var tableData = [];
        tableData.push(<td key={key + "event"}>{eventName}</td>)
        if (this.eventsAttending.includes(eventName)){
            tableData.push(<td key={key + "adult"}>{this.numberAttending[eventName]["adults"]}</td>)
            tableData.push(<td key={key + "child"}>{this.numberAttending[eventName]["children"]}</td>)    
        }
        else{
            tableData.push(<td key={key + "adult"}>0</td>)
            tableData.push(<td key={key + "child"}>0</td>)    
        }
        return tableData
    }

    render(){
        return(
            <div id="eventInfo" key="eventInfo">
                <div id="allEventStatuses">
                    {this.invitedEvents.map((event, key) => ([
                        <EventStatus key={key} event={event} attending={this.eventsAttending.includes(event)}/>,
                        (key < this.invitedEvents.length - 1)
                            ? <hr key={key + "hr"}/>
                            : null
                    ]
                    ))}
                </div>
                <p id="rsvpSummary">RSVP Summary:</p>
                <table id="Attending">
                    <thead>
                        <tr>
                            <td>Event</td>
                            <td>Adults</td>
                            <td>Children</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.invitedEvents.map((event, key) => (
                            <tr key={key}>
                                {this.getTableBody(event)}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p id="email">Email: </p>
                {(this.eventsAttending.length !== 0)
                    ? <p id="emailAddress">{JSON.parse(sessionStorage.getItem('email'))}</p>
                    : <p id="emailAddress">Not Provided</p>
                }
            </div>
        );

    }
}
