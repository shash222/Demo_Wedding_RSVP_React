import React, {Component} from 'react';
import '../css/Lodging.css'
import LodgingDetail from '../Components/LodgingDetail'
import data from '../res/Data.js'

export default class Lodging extends Component{

    invitedEvents = JSON.parse(sessionStorage.getItem('invitedEvents'))

    invitedEventsLodging = [];

    componentWillMount(){
	data.lodging.map((lodgingDetail, key) => {
	    if (this.invitedEvents.includes(lodgingDetail.event))
		this.invitedEventsLodging.push(lodgingDetail);
	});
    }

    render(){
        return(
            <div>
		{this.invitedEventsLodging.map((lodgingDetail, key) => ([
		    <LodgingDetail key={key} details={lodgingDetail} />,
                    (key < this.invitedEventsLodging.length - 1)
                        ? <hr key={key + "hr"}/>
                        : null
		]))}
            </div>
        );

    }
}
