import React, { Component } from 'react';
import data from '../res/Data'
import '../css/Contact.css'

export default class Contact extends Component {

    contacts = data.contactDetails.directContacts;

    render() {
        return (
            <div>
                <p id="contactEmail">Email:<br />{data.contactDetails.email}</p>
                {this.contacts.map((contact, key) => ([
                    <p key={key}>
                        <span className="contactName">{contact.name}</span><br />
                        <span className="contactNumber">{contact.number}</span><br />
                        <span className="contactRelationship">{contact.relationship}</span>
                    </p>
                ]))}
                {/* {data.contactDetails.directContacts} */}
            </div>
        );

    }
}