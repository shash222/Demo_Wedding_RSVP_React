import React, {Component} from 'react';
import '../css/LoginPage.css';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

export default class LoginPage extends Component{
    constructor(props){
        super();
        this.state = {
            errorMessage: "",
            redirectToEventInfo: false,
            redirectToRSVP: false,
        }

        this.validateLogin = this.validateLogin.bind(this);
    
    }

    setHeaderBottomBorder(){
        var themeColor = getComputedStyle(document.getElementById("couple")).color;
        document.getElementById("header").style.borderBottom = `1px solid ${themeColor}`;
    }

    componentDidMount(){
	if (window.location.pathname !== "/"){
	    var prePopulateValues = window.location.pathname.split("/");
	    document.getElementsByName("City")[0].value = prePopulateValues[1].replace(/%20/g, " ").split("city=")[1];
	    if (prePopulateValues.length === 3)
	        document.getElementsByName("Name")[0].value = prePopulateValues[2].replace(/%20/g, " ").split("name=")[1];
	}
        // Set arrow styles
        var container = document.getElementById("container");
        var containerTop = container.offsetTop;
        var containerWidth = container.offsetWidth;
        var containerLeft = container.offsetLeft;
	var containerHeight = container.offsetHeight;

        var windowHeight = window.innerHeight;

        var nextArrow = document.getElementById("nextArrow");
	
	var arrowImgSize = document.getElementsByClassName("arrow")[0].offsetWidth;

        nextArrow.style.left = (containerWidth/2 - arrowImgSize) + "px";
     //   nextArrow.style.top = (((windowHeight - containerTop)/2) + containerTop) + "px";

//        nextArrow.style.top = (containerTop + containerHeight) + "px";

        this.setHeaderBottomBorder();
    }

    validateLogin(e){
        e.preventDefault();
        var name = document.getElementsByName("Name")[0].value;
        var city = document.getElementsByName("City")[0].value;
        if (name === "") this.setState({errorMessage: "Please enter full name"})
        else if (city === "") this.setState({errorMessage: "Please enter city"})
        else{
            axios.get(`https://server.hashmi.site:5000/api/validateLogin/${name}/${city}`)
            .then((res) => {
                if (res.data.success === true){
                    sessionStorage.setItem('name', JSON.stringify(res.data.name) || "");
                    sessionStorage.setItem('city', JSON.stringify(res.data.city) || "");
                    sessionStorage.setItem('email', JSON.stringify(res.data.email) || "");
                    sessionStorage.setItem('dateSubmitted', JSON.stringify(res.data.dateSubmitted));
                    sessionStorage.setItem('dateUpdated', JSON.stringify(res.data.dateUpdated));
                    sessionStorage.setItem('invitedEvents', JSON.stringify(res.data.invitedEvents))
                    sessionStorage.setItem('eventsAttending', JSON.stringify(res.data.eventsAttending))
                    sessionStorage.setItem('numberOfInvitees', JSON.stringify(res.data.numberOfInvitees))
                    sessionStorage.setItem('numberAttending', JSON.stringify(res.data.numberAttending))
		    console.log(res.data);
		    console.log(sessionStorage);
			console.log(sessionStorage.getItem("eventsAttending"));
                    // This is for if user previously selected not attending a specific event, then later changes their mind
                    // Without this, if user switches back, dropdown in Attendance view stays at 0 instead of going back up to max invited for both children and adults
                    sessionStorage.setItem('eventsAttendingDBValues', JSON.stringify(res.data.eventsAttending));
                    if (res.data.email) this.setState({redirectToEventInfo:true})
                    else this.setState({redirectToRSVP:true})
                }
                else this.setState({errorMessage: "Invalid Credentials"})
            })
        }
    }

    render(){
        return(
            <div id="container">
                <form id="loginForm">
                    <p className="errorMessage">{this.state.errorMessage}</p>
                    <p><span id="enterFamilyName">Enter Family Name:</span><br /><span>As it Appears on Invitation</span></p>
                    <input type="text" placeholder="FULL NAME" name="Name"/>
                    <input type="text" placeholder="CITY (ONLY)" name="City"/>
                    <p id="ifEmailed">Enter "Evite" in place of City if the card was emailed to you.</p>
                    <input type="image" id="nextArrow" className="arrow" src={require("../res/arrow.png")} onClick={(e) => this.validateLogin(e)} alt="Next Page" /> 
                    {/* <img id="nextArrow" className="arrow" src={require("../res/arrow.png")} onClick={this.validateLogin} alt="Next Page"/> */}
                    {this.state.redirectToEventInfo
                        ? <Redirect to="/EventInfo" />
                        : null
                    }
                    {this.state.redirectToRSVP
                        ? <Redirect to="/RSVP" />
                        : null
                    }
                </form>
            </div>
        );
    }
}
