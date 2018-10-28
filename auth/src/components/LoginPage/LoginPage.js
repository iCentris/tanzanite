import React, { Component } from "react";
import LoginForm from "./LoginForm";
import querystring from "query-string";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      isSuccess: false,
      error: null,
      return_url: "/"
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

        this.setState({
          return_url
        });

        return signin_payload;
      })
      .then((signin_payload) => {
        return this.props.auth.signinAndRefresh(signin_payload).then(() => {
          this.setState({
            isSuccess: true,
            error: null
          });
        })
        .catch(error => Promise.reject(error));
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

LoginPage.propTypes = {
  auth: PropTypes.shape({
    signinAndRefresh: PropTypes.func.isRequired,
    buildSigninPayload: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  })
};

LoginPage.defaultProps = {
  location: {
    search: ""
  }
};

export default LoginPage;
