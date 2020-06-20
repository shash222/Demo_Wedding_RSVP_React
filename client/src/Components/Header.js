import React, { Component } from 'react';
import '../css/Header.css';
import data from '../res/Data';

export default class Header extends Component {
    render() {
        return (
            <div id="header">
                <img id="bismillah" src={require("../res/bismillah.png")} alt="Bismillah" />
                <h1 id="couple" className="cursive theme">{data.couple.groom} & {data.couple.bride}'s Wedding</h1>
                <p id="invitedBy">Invited by Mr. & Mrs. {data.parents}</p>
            </div>
        );
    }
}
