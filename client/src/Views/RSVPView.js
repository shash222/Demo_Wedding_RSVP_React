import React, { Component } from 'react';
import RSVP from './RSVP';
import Attendance from './Attendance';
import Confirmation from './Confirmation'
import '../css/RSVP.css';
import axios from 'axios';
import data from '../res/Data.js'

export default class RSVPView extends Component {


    constructor(props) {
        super(props)

        this.state = {
            currentView: 0,
            arrowStyle: {
                top: 0,
                nextArrowLeft: 0,
                prevArrowLeft: 0,

            },
            nextArrowStyle: {
                top: 0,
                left: 0,
            },
            prevArrowStyle: {
                top: 0,
                left: 0,
            },
            errorMessage: "",
            // If Previous Arrow was hit
            // This is for setting RSVP selection values if first time accessing website and coming from Attendance page

        }
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

    }

    views = [];

    getView() {
        return this.views[this.state.currentView]
    }

    componentDidMount() {
        this.views = [<RSVP comingFromNextPage={this.state.comingFromNextPage} />, <Attendance />, <Confirmation />];

        var container = document.getElementById("container");
        var containerTop = container.offsetTop;
        var containerWidth = container.offsetWidth;
        var containerLeft = container.offsetLeft;

        var windowHeight = window.innerHeight;

        var navBarHeight = document.getElementById("navigationBar").clientHeight;

        var arrowImgSize = document.getElementsByClassName("arrow")[0].offsetWidth;

        var nextArrow = document.getElementById("nextArrow");

        nextArrow.style.left = (containerWidth / 2 - arrowImgSize) + "px";
        //     nextArrow.style.top = (((windowHeight - containerTop) / 2) + containerTop - navBarHeight) + "px";

        //     nextArrow.style.top = (windowHeight / 2 + 100) + "px";

        var prevArrowLeft = (-containerWidth / 2 + arrowImgSize) + "px";
        this.setState({ arrowStyle: { /*top: nextArrow.style.top,*/ nextArrowLeft: nextArrow.style.left, prevArrowLeft: prevArrowLeft } })
    }

    componentDidUpdate() {
        var nextArrow = document.getElementById("nextArrow");
        var prevArrow = document.getElementById("previousArrow");
        if (this.state.currentView !== this.views.length - 1) {
            nextArrow.style.left = this.state.arrowStyle.nextArrowLeft;
            //        nextArrow.style.top = this.state.arrowStyle.top;
        }

        if (this.state.currentView !== 0) {
            prevArrow.style.left = this.state.arrowStyle.prevArrowLeft;
            //      prevArrow.style.top = this.state.arrowStyle.top;
        }

    }

    // @param updateKey name of the sessionStorage key to be updated
    // @param updateValues values to be updated

    getDateTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (String(month).length === 1) month = "0" + month;
        if (String(dayOfMonth).length === 1) dayOfMonth = "0" + dayOfMonth;
        if (String(hour).length === 1) hour = "0" + hour;
        if (String(minute).length === 1) minute = "0" + minute;
        if (String(second).length === 1) second = "0" + second;
        var dateTime = (`${year}-${month}-${dayOfMonth} ${hour}:${minute}:${second}`)
        return dateTime;
    }


    updateSessionStorage(updateKey, updateValues) {

        var submitValue;
        if (updateKey === "eventsAttending") {
            var events = [];
            updateValues.map((attendingEvent) => {
                var eventName = Object.keys(attendingEvent)[0]

                // if event is marked as attending, add to list
                if (attendingEvent[eventName]) events.push(eventName)
            })

            submitValue = events;
        }
        else if (updateKey === "email") {
            submitValue = updateValues
        }
        else if (updateKey === "numberAttending") {
            submitValue = updateValues
        }
        sessionStorage.setItem(String(updateKey), JSON.stringify(submitValue));
    }

    updateDatabase() {
        axios.post('https://server.hashmi.site:5000/api/updateDB', {
            name: JSON.parse(sessionStorage.getItem('name')),
            city: JSON.parse(sessionStorage.getItem('city')),
            email: JSON.parse(sessionStorage.getItem('email')),
            dateSubmitted: JSON.parse(sessionStorage.getItem('dateSubmitted')),
            dateUpdated: JSON.parse(sessionStorage.getItem('dateUpdated')),
            invitedEvents: JSON.parse(sessionStorage.getItem('invitedEvents')),
            eventsAttending: JSON.parse(sessionStorage.getItem('eventsAttending')),
            numberOfInvitees: JSON.parse(sessionStorage.getItem('numberOfInvitees')),
            numberAttending: JSON.parse(sessionStorage.getItem('numberAttending')),

        }).then((res) => {
            console.log(res);
        })
    }


    // Email validation
    checkEmail() {
        // following line prevents "re" variable data from causing warning in console
        // eslint-disable-next-line
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = document.getElementById("emailInput").value;

        if (re.test(String(email).toLowerCase())) {
            this.updateSessionStorage("email", email.toLowerCase());
            return true;
        }

        return false;

    }

    // Creating method in RSVPView rather than individual View because it needs to be triggered once either arrow is clicked
    // Do not have access to the buttons within the other components
    // Checks if all items have been entered, otherwise does not change View
    // If all data is valid, updates sessionStorage and DB and changes View
    validateInputs(increment) {
        var notAttendingCounter = 0;
        var nextView = this.state.currentView + increment;
        var invitedEvents = JSON.parse(sessionStorage.getItem("invitedEvents"));
        // RVSP View is rendered
        if (this.state.currentView === 0) {
            var eventResponses = document.querySelectorAll("input[type='radio']:checked");
            if (eventResponses.length < invitedEvents.length) this.setState({ errorMessage: "Missing Responses" });
            else {
                var updateValues = [];
                Array.prototype.map.call(eventResponses, (eventResponse) => {
                    if (eventResponse.value === "yes") {
                        var updateValue = {};
                        updateValue[eventResponse.name] = true;
                        updateValues.push(updateValue);
                    }
                })
                this.updateSessionStorage("eventsAttending", updateValues);
                this.setState({ errorMessage: "", currentView: nextView });
            }


            /*
             *
             * Originally used to validate and update events Attending values with checkbox selection, switching to radio check
                    var eventResponses = document.querySelectorAll(".eventResponse");
                        var selectedResponses = document.querySelectorAll(".selectedResponse");
                        if (selectedResponses.length < eventResponses.length) this.setState({ errorMessage: "Missing responses" })
                        else {
                            // using Array.prototype because selectedResponse is not typical array
                            // it is list of HTMLelements
                            var updateValues = [];
                            Array.prototype.map.call(selectedResponses, (selectedResponse) => {
                                var eventName = selectedResponse.dataset.eventname;
                                var attending = (selectedResponse.dataset.value === "yes")
                                    ? true
                                    : false;
                                if (selectedResponse.dataset.value === "no") notAttendingCounter++;
                                var updateValue = {}
                                updateValue[eventName] = attending
                                updateValues.push(updateValue);
                            })
                            this.updateSessionStorage("eventsAttending", updateValues);
                            // if (notAttendingCounter === JSON.parse(sessionStorage.getItem('invitedEvents')).length) nextView++;
                            this.setState({ errorMessage: "", currentView: nextView})
                            return true;
              
                        }
              
              */
        }

        // Attendance View is rendered
        else if (this.state.currentView === 1) {

            var isValidEmail = this.checkEmail();

            // Update attendance values
            var attendanceValues = document.querySelectorAll("select");
            var attendanceObject = {}
            Array.prototype.map.call(attendanceValues, (attendanceValue) => {
                if (attendanceObject[attendanceValue.name] === undefined) attendanceObject[attendanceValue.name] = {}
                attendanceObject[attendanceValue.name][attendanceValue.dataset.type] = attendanceValue.value;
            });

            this.updateSessionStorage("numberAttending", attendanceObject);

            if (isValidEmail) {
                this.setState({ errorMessage: "", currentView: nextView })
                return true;
            }
            else {
                this.setState({ errorMessage: "Email is invalid" });
            }
        }

        // Handles back arrow on confirmation page
        else if (this.state.currentView === 2) {
            this.setState({ currentView: nextView })
        }

        return false;
    }

    nextPage(e) {
        e.preventDefault();
        if (this.validateInputs(1)) {
            if (this.state.currentView === 0) {
                sessionStorage.setItem("setRSVPEvents", "true");
            }
            else if (this.state.currentView === 1) {
                var dateTime = JSON.stringify(this.getDateTime());
                if (JSON.parse(sessionStorage.getItem("dateSubmitted")) === "") sessionStorage.setItem("dateSubmitted", dateTime);
                sessionStorage.setItem("dateUpdated", dateTime);
                sessionStorage.setItem('eventsAttendingDBValues', JSON.stringify(sessionStorage.getItem("eventsAttending")));
                this.updateDatabase();
            }
        }
    }

    previousPage(e) {
        e.preventDefault();
        var nextView = this.state.currentView - 1;
        this.setState({ comingFromNextPage: true, errorMessage: "", currentView: nextView })
    }

    render() {
        return (
            <form>
                {(this.state.currentView === 0
                    ? <p id="requestsPleasureOfCompany">The Hashmi Family requests the pleasure of your company at the wedding of their son, {data.childName}</p>
                    : null)}
                <p className="errorMessage">{this.state.errorMessage}</p>
                {this.getView()}
                {this.state.currentView !== (this.views.length - 1)
                    ? <input type="image" src={require("../res/arrow.png")} id="nextArrow" className="arrow" onClick={(e) => this.nextPage(e)} alt="Next Page" />
                    : null}
                {this.state.currentView !== 0
                    ? <input type="image" src={require("../res/arrow.png")} id="previousArrow" className="arrow" onClick={(e) => this.previousPage(e)} alt="Previous Page" />
                    : null}
            </form>
        )
    }
}
