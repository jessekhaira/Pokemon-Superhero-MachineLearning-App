import React from 'react';
import InstructionsConv from './InstructionsConv';
import InstructionsLanguageModel from './InstructionsLanguageModel';
import NavBar from './NavBar';
import LanguageModel from './LanguageModel'; 
import Conv_Model from './Conv_Model';
import '../stylesheets/App.css'; 
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

class App extends React.Component {
  _addSpinnerAsync() {
    const spinnerDiv = document.createElement('div');
    spinnerDiv.className = "spinner";
    return spinnerDiv;
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
              <InstructionsLanguageModel _addSpinnerAsync = {this._addSpinnerAsync} />
              <LanguageModel /> 
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
