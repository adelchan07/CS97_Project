import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WelcomePage from "./LoginSignup/welcomePage";
import LoginForm from "./LoginSignup/loginForm";
import SignupForm from "./LoginSignup/signupForm";

class App extends React.Component {
  render() {
    return (
        <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <WelcomePage
              ></WelcomePage>
            </Route>
            <Route exact path="/SignupForm">
              <SignupForm
              ></SignupForm>
            </Route>
            <Route exact path="/LoginForm">
              <LoginForm
              ></LoginForm>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
