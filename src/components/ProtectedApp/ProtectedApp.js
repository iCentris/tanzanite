import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProtectedApp extends Component {
  constructor(props) {
    super(props);

    this.getReturnUrl = this.getReturnUrl.bind(this);
  }

  getReturnUrl() {
    return this.props.location.pathname + this.props.location.search + this.props.location.hash;
  }

  getLoginUrl() {
    return this.props.auth.getLoginUrl(this.getReturnUrl());
  }

  render() {
    const { isVerified, initialized } = this.props.auth;

    if(!initialized) return <div>Initializing...</div>;

    if (isVerified) {
      return (
        <div>
          Welcome to the protected App. Enjoy your stay!
          <br />
          <Link to="/signout">
            <button>Signout</button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        Unauthorized access, please <br />
        <Link to={this.getLoginUrl()}>
          <button>Login</button>
        </Link>
      </div>
    );
  }
}

ProtectedApp.propTypes = {
  auth: PropTypes.shape({
    getLoginUrl: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
    hash: PropTypes.string,
    pathname: PropTypes.string
  })
};

ProtectedApp.defaultProps = {
  location: {
    pathname: "/",
    hash: null,
    search: null,
  }
};

export default ProtectedApp;
