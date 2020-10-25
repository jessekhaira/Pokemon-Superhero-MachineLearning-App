import React from 'react';
import InstructionsConv from './InstructionsConv';
import InstructionsLanguageModel from './InstructionsLanguageModel';
import NavBar from './NavBar';
import LanguageModel from './LanguageModel'; 
import Conv_Model from './Conv_Model';
import '../stylesheets/App.css'; 
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

/**
 * This class is the primary wrapper component for the app, wrapping all the other components. Routing
 * is also done in this component with React-Router.
 * 
 * All of the methods defined in this class are used within components nested inside this component,
 * and are meant to be passed down as props (to keep code DRY). 
 * 
 * @class
 * @public 
 */
class App extends React.Component {
  /**
   * This method creates a loader whenever an asynchronous action is started. 
   */
  _addSpinnerAsync() {
    const spinnerDiv = document.createElement('div');
    // specific loader requires 4 nested divs 
    for (let i=0; i<4; i++) {
      spinnerDiv.appendChild(document.createElement('div'));
    }
    spinnerDiv.className = "spinner";
    return spinnerDiv;
  }

  /**
   * This method takes a variable number of arguments as inputs, and sets all of their displays to 
   * none. Useful when performing asynchronous actions and the displays of many elements has to be set to none
   * when the action is dispatched and a loader is showing. 
   * 
   * @param  {HTMLElement} args DOM nodes that will be hidden from the display
   */
  _hideDisplays(...args) {
    console.log(args);
    args.forEach((obj) => obj.style.display = 'none');
  }

  /**
   * This method takes a variable number of arguments as inputs, and sets all of their displays to 
   * block. Useful when performing asynchronous actions and data is recieved from the action, and has to be 
   * added to the appropriate div components and shown on the page. 
   * 
   * @param  {HTMLElement} args DOM nodes that will be hidden from the display
   * 
   */
  _showDisplays(...args) {
    args.forEach((obj) => obj.style.display = 'block');
  }

  render() {
    return (
      <div className="App">
        <Router>
          {/* Navbar is on every route */}
          <Route>
            <NavBar /> 
          </Route>

          <Switch>

            <Route exact path = "/getName">

              <InstructionsLanguageModel 
              _addSpinnerAsync = {this._addSpinnerAsync} 
              _hideDisplays = {this._hideDisplays}
              _showDisplays = {this._showDisplays}/>

              <LanguageModel 
              _addSpinnerAsync = {this._addSpinnerAsync} 
              _hideDisplays = {this._hideDisplays}
              _showDisplays = {this._showDisplays}/> 
              
            </Route>

            {/* Least specific route is last one to be matched! */}
            <Route path = "/">
              <InstructionsConv />
              <Conv_Model /> 
            </Route>

          </Switch>
          
        </Router>
      </div>
    );
  }
}

export default App;
