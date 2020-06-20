import React, {Component} from 'react';
import {NavLink} from 'react-router-dom'

import '../css/NavigationBar.css';

export default class NavigationBar extends Component{

// Modify this to add or remove links
// Links will be displayed in NavBar in the order this are listed
    links = [
        {path: "/RSVP", name: "RSVP"},
        {path: "/EventInfo", name: "Event Info"},
        {path: "/Contact", name: "Contact"},
        {path: "/Lodging", name: "Lodging"},
    ]

    componentDidMount(){
        this.setNavBarToThemeColor()
    }

    setNavBarToThemeColor(){
        var themeColor = getComputedStyle(document.getElementById("couple")).color;
        document.getElementById("navigationBar").style.backgroundColor = themeColor;
    }

    render(){
        return(
            <ul id="navigationBar" className="theme">
                {this.links.map((link, key) => (
                    <li key={key}><NavLink to={link.path}>{link.name}</NavLink></li>
                ))}
            </ul>
        );
    }
}