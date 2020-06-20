import React, {Component} from 'react';
import '../css/LodgingDetail.css'
import data from "../res/Data"

export default class LodgingDetail extends Component{

    invitedEvents = JSON.parse(sessionStorage.getItem('invitedEvents'));

    state = {
        info: {},
    }

    componentDidMount(){
        this.getLodgingInfo();
    }

    getLodgingInfo(){
	if (this.invitedEvents.includes(this.props.details.event)){
	    this.setState({info: this.props.details});
	}
    }
 

    render(){
        return(
            <div className="lodgingContainer">
                <p className="lodgingLeft">
                    <span className="lodgingLocation">{this.state.info.location}</span><br />
                    <span className="lodgingDescription">{this.state.info.description}</span>
                </p>
                <div className="lodgingRight">
                    <p className="lodgingAddress">
                        <span>{this.state.info.address}<br /></span>
                        <span>{this.state.info.city}<br /></span>
                        <span>{this.state.info.phone}</span>
                    </p>
                    <p>
                        <span className="lodgingRate">Rate: {this.state.info.rate}</span><br/>
                        <span>Reference: {this.state.info.reference}</span>
                    </p>
                </div>
            </div>
        );

    }
}
