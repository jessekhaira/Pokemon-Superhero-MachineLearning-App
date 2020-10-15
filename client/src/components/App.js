import React from 'react';
import InstructionsConv from './InstructionsConv';
import InstructionsLanguageModel from './InstructionsLanguageModel';
import NavBar from './NavBar';
import LanguageModel from './LanguageModel'; 
import Conv_Model from './Conv_Model';
import '../stylesheets/App.css'; 
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

class App extends React.Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}

        <Router>
          {/* Navbar is on every route */}
          <Route>
            <NavBar /> 
          </Route>

          <Switch>
            <Route exact path = "/getName">
              <InstructionsLanguageModel />
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
