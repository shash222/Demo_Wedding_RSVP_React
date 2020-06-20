import React, { Component } from 'react';
import '../css/Attendance.css';

export default class Attendance extends Component {

    invitedEvents = JSON.parse(sessionStorage.getItem('invitedEvents'));
    eventsAttending = JSON.parse(sessionStorage.getItem('eventsAttending'));
    numberOfInvitees = JSON.parse(sessionStorage.getItem('numberOfInvitees'));

    componentDidMount() {
        if (JSON.parse(sessionStorage.getItem('dateSubmitted')) !== "" || this.eventsAttending.length < this.invitedEvents.length) this.prePopulateData();

    }

    // Populates entries with database values
    prePopulateData() {

        // Populates email text box
        if (sessionStorage.getItem('email') !== "") document.getElementById("emailInput").value = JSON.parse(sessionStorage.getItem('email'));

        // Populates attendance values
        var attendanceValues = document.querySelectorAll("select");
        var numberAttending = JSON.parse(sessionStorage.getItem('numberAttending'))
        Array.prototype.map.call(attendanceValues, (attendanceValue) => {
            if (this.eventsAttending.includes(attendanceValue.name)){
		if (JSON.parse(sessionStorage.getItem("dateSubmitted")) !== "" && JSON.parse(sessionStorage.getItem("eventsAttendingDBValues").includes(attendanceValue.name)))
                    attendanceValue.value = numberAttending[attendanceValue.name][attendanceValue.dataset.type];
		
	    }

            else {
                attendanceValue.value = 0;
                attendanceValue.disabled = true;
            }
        })

    }

    getAttendanceDropdown(eventName, type) {
        var num = this.numberOfInvitees[eventName][type]
        var options = [];
        for (var i = num; i >= 0; i--) options.push(<option key={eventName + "option" + i}>{i}</option>);
        return options
    }

    render() {
        return (
            <div>
                <h2>Family Name: {sessionStorage.getItem('name')}</h2>
                <table>
                    <thead>
                        <tr>
                            <td>Event:</td>
                            <td>Total Guests Invited:</td>
                            <td>Adults:</td>
                            <td>Children<br />(5-20):</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.invitedEvents.map((event, key) => (
                            <tr key={key}>
                                <td>{event}</td>
                                {/* "|| 0" means if the value is undefined, use 0 */}
                                <td key={key + "total"}>{this.numberOfInvitees[event].total || 0}</td>
                                <td key={key + "adult"}>{this.numberOfInvitees[event].adults || 0}</td>
                                <td key={key + "child"}>{this.numberOfInvitees[event].children || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <div id="attendanceSelection">
                        <div>
                            <h4>Event:</h4>
                            {this.invitedEvents.map((event, key) => (
                                <p key={key}>{event}</p>
                            ))}
                        </div>
                        <div>
                            <h4>Adults:</h4>
                            {this.invitedEvents.map((event, key) => (
                                <select key={key} name={event} data-type="adults">
                                    {this.getAttendanceDropdown(event, "adults")}
                                </select>
                            ))}
                        </div>
                        <div>
                            <h4>Children:</h4>
                            {this.invitedEvents.map((event, key) => (
                                <select key={key} name={event} data-type="children">
                                    {this.getAttendanceDropdown(event, "children")}
                                </select>
                            ))}
                        </div>
                    </div>
                    <p id="note">Note: Children under 5 are not included in the count</p>
                </div>
                <b id="emailText">Enter Email Address:</b>
                <input id="emailInput" type="email" placeholder="EMAIL" />
                <b>***Information will be saved after you hit next***</b>
            </div>
        );
    }
}
