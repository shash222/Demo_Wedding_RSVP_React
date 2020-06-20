import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './Components/Header';
import NavigationBar from './Components/NavigationBar';

import LoginPage from './Views/LoginPage';
import EventInfo from './Views/EventInfo';
// import RSVP from './Views/RSVP';
import RSVPView from './Views/RSVPView';
import Attendance from './Views/Attendance';
import Confirmation from './Views/Confirmation';
import Contact from './Views/Contact';
import Lodging from './Views/Lodging';
import {Redirect} from 'react-router-dom';

import './css/App.css';

export default class App extends Component {

  state = {
    currentPath: "",
    loopCounter: 0,
  };

  componentDidMount(){
    document.title="Hashmi Wedding"
  }


  render() {

    const AuthenticatedRoutes = () => {
      return (
        <div >
          <NavigationBar />
          <div id="container">
            <Switch>
	      {/* Allow access to any other page if user is logged in (based on sessionStorage data */}
                      <Route path="/EventInfo" component={EventInfo} />
                      <Route path="/RSVP" component={RSVPView} />
                      <Route path="/Attendance" component={Attendance} />
                      <Route path="/Confirmation" component={Confirmation} />
                      <Route path="/Contact" component={Contact} />
                      <Route path="/Lodging" component={Lodging} />
              <Route render={() => (<Redirect to="/" />)}/>
            </Switch>
          </div>

        </div>

      )
    }

    return (
      <div id="body">
        <Router className="App">
          <Header />
          <Switch>
	    {/* Show login page if use is not currently logged in*/}
            	    <Route path="/" exact component={LoginPage} />
	    	    <Route path="/city=:city" exact component={LoginPage} />
	    	    <Route path="/city=:city/name=:name" exact component={LoginPage} />
            	    <Route component={AuthenticatedRoutes} />

		
          </Switch>
        </Router>
      </div>
    );
  };
}
