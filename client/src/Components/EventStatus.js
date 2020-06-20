import React, {Component} from 'react';
import data from '../res/Data';
import '../css/EventStatus.css';
import {BrowserView, MobileView} from 'react-device-detect';

export default class EventStatus extends Component{

    state = {
        event: {},
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        for (var i = 0; i < data.events.length; i++){
            if (this.props.event === data.events[i].name){
                this.setState({event: data.events[i]});
            }
        }
    }

    render(){
        return(
            <div className="eventStatusContainer">
				<div className="eventStatusTop">
					<p className="eventStatusEventName cursive">{this.state.event.name}</p>
					<BrowserView>
						<p className="eventStatusDate cursive">{this.state.event.day + this.state.event.date + ", " + this.state.event.year}</p>
					</BrowserView>
					<MobileView>
						<p className="eventStatusDate cursive">{this.state.event.day}<br />{this.state.event.date + ", " + this.state.event.year}</p>
					</MobileView>
				</div>
				<div className="eventStatusBottom">
					<p className="eventAttendanceStatus" data-eventname={this.props.event}></p>
					<p className="location">
						<span className="locationName">{this.state.event.location}</span><br />
						<span>{this.state.event.address}</span><br />
						<span>{this.state.event.city}</span>
					</p>
				</div>
            </div>
        );
    }
}
