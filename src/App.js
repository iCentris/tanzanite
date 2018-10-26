import React from "react";
import { AuthProvider, withAuth } from "./components/AuthContext";
import Auth from "./lib/Auth";
import config from "./config";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import ProtectedApp from "./components/ProtectedApp";
import LoginPage from "./components/LoginPage";

import ProcessSignin from "./components/ProcessSignin";
import ProcessSignout from "./components/ProcessSignout";

const myAuth = new Auth(config.auth);

const App = () => (
  <AuthProvider auth={myAuth}>
    <Router>
      <Switch>
        <Route path="/signin" component={withAuth(ProcessSignin)} />
        <Route path="/login" component={withAuth(LoginPage)} />
        <Route path="/signout" component={withAuth(ProcessSignout)} />
        <Route component={withAuth(ProtectedApp)} />
      </Switch>
    </Router>
  </AuthProvider>
);

export default App;
