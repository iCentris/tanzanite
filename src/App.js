import React from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";
import Auth from "./lib/Auth";
import config from "./config";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import ProtectedApp from "./components/ProtectedApp";
import LoginPage from "./components/LoginPage";

import ProcessSignin from "./components/ProcessSignin";

const myAuth = new Auth(config.auth);

const App = props => (
  <AuthProvider auth={myAuth}>
    <Router>
      <AuthConsumer>
        {({ auth }) => {
          return (
            <Switch>
              <Route path="/signin" component={ProcessSignin} />
              <Route path="/login" component={LoginPage} />
              <Route component={ProtectedApp} />
            </Switch>
          );
        }}
      </AuthConsumer>
    </Router>
  </AuthProvider>
);

export default App;
