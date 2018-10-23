import React, { Component } from "react";
import LoginForm from "./LoginForm";
import querystring from "query-string";
import { withAuth } from "../AuthContext";
import { Link } from "react-router-dom";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      isSuccess: false,
      return_url: "/",
      error: null
    };

    this.state = this.initialState;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveReturnUrl = this.retrieveReturnUrl.bind(this);
  }

  retrieveReturnUrl(search) {
    return querystring.parse(search).payload || this.state.return_url;
  }

  handleSubmit({ username, password }) {
    Promise.resolve()
      .then(() => {
        const signin_payload = this.props.auth.buildSigninPayload({
          username,
          password
        });
        const return_url = this.retrieveReturnUrl(this.props.location.search);
        return { signin_payload, return_url };
      })
      .then(({ signin_payload, return_url }) => {
        return this.props.auth.signinAndRefresh(signin_payload).then(() => {
          this.setState({
            isSuccess: true,
            return_url,
            error: null
          });
        });
      })
      .catch(error => {
        this.setState({
          isSuccess: false,
          error
        });
      });
  }

  render() {
    const { error, isSuccess, return_url } = this.state;
    return (
      <div>
        {isSuccess && (
          <div>
            Congratulations, login was successful.
            <br />
            <Link to={return_url}>
              <button>Go to Return URL</button>
            </Link>
          </div>
        )}
        {error && <div>Error! {error.message}</div>}
        {!isSuccess && <LoginForm {...this.props} handleSubmit={this.handleSubmit} /> }
      </div>
    );
  }
}

export default withAuth(LoginPage);
