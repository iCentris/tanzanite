import React, { Component } from "react";
import { Provider } from "./context";
import store from "store";
import isEqual from "lodash.isequal";
import PropTypes from "prop-types";
import Auth from "../../lib/Auth";

class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.store_key = props.store_key;
    this.store = props.store;

    this.initialState = {
      initialized: false,
      isLoading: false,
      isVerified: false,
      error: null,
      auth: {
        access_token: null,
        refresh_request: {
          sec: null,
          aud: null,
          sub: null
        }
      }
    };

    this.hydrateAuthState = this.hydrateAuthState.bind(this);
    this.setStateAndPersist = this.setStateAndPersist.bind(this);
    this.persistAuthState = this.persistAuthState.bind(this);
    this.getPersistedAuthState = this.getPersistedAuthState.bind(this);
    this.verifyRefreshOrLogin = this.verifyRefreshOrLogin.bind(this);
    this.refreshOrLogin = this.refreshOrLogin.bind(this);
    this.signinAndRefresh = this.signinAndRefresh.bind(this);
    this.verifyAccessToken = this.verifyAccessToken.bind(this);
    this.refreshAccessToken = this.refreshAccessToken.bind(this);
    this.signin = this.signin.bind(this);
    this.signout = this.signout.bind(this);
    this.getLoginUrl = this.getLoginUrl.bind(this);
    this.login = this.login.bind(this);
    this.buildSigninPayload = this.buildSigninPayload.bind(this);

    this.state = {
      ...this.initialState,
      signinAndRefresh: this.signinAndRefresh,
      verifyAccessToken: this.verifyAccessToken,
      verifyOrRefresh: this.verifyOrRefresh,
      refreshAccessToken: this.refreshAccessToken,
      verifyRefreshOrLogin: this.verifyRefreshOrLogin,
      refreshOrLogin: this.refreshOrLogin,
      signin: this.signin,
      signout: this.signout,
      getLoginUrl: this.getLoginUrl,
      login: this.login,
      buildSigninPayload: this.buildSigninPayload
    };
  }

  setStateAndPersist(state_changes) {
    this.setState(state_changes, this.persistAuthState);
  }

  persistAuthState() {
    //if the state is empty, just delete the key rather than save it
    if (isEqual(this.state.auth, this.initialState.auth)) {
      return this.store.remove(this.store_key);
    }

    this.store.set(this.store_key, this.state.auth);
  }

  getPersistedAuthState() {
    const persistedState = this.store.get(this.store_key);
    return persistedState;
  }

  hydrateAuthState(cb) {
    const authState = this.getPersistedAuthState();
    if (!authState) return cb();

    this.setState({ auth: authState }, cb);
  }

  componentDidMount() {
    const cb = () => {
      this.verifyOrRefresh()
        .catch(error => {
          this.setState({
            isVerified: false,
            error
          });
        })
        .finally(() => {
          this.setState({
            initialized: true,
            isLoading: false
          });
        });
    };

    this.hydrateAuthState(cb);
  }

  verifyOrRefresh() {
    return this.verifyAccessToken().catch(() => this.refreshAccessToken());
  }

  verifyRefreshOrLogin() {
    return this.verifyAccessToken().catch(() => this.refreshOrLogin());
  }

  refreshOrLogin() {
    return this.refreshAccessToken().catch(() => this.login());
  }

  signinAndRefresh(payload) {
    return this.signin(payload).then(() => this.refreshAccessToken());
  }

  verifyAccessToken() {
    return this.props.auth
      .verifyAccessToken(this.state.auth.access_token)
      .then(() => {
        this.setState({
          isLoading: false,
          isVerified: true,
          error: null
        });
        return Promise.resolve();
      })
      .catch(error => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error,
          auth: {
            ...this.state.auth,
            access_token: null
          }
        });
        return Promise.reject(error);
      });
  }

  refreshAccessToken() {
    return this.props.auth
      .refreshAccessToken(this.state.auth.refresh_request)
      .then(access_token => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: true,
          error: null,
          auth: {
            ...this.state.auth,
            access_token
          }
        });
        return Promise.resolve(access_token);
      })
      .catch(error => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error,
          auth: {
            ...this.state.auth,
            refresh_request: this.initialState.refresh_request
          }
        });
        return Promise.reject(error);
      });
  }

  _signin(payload) {
    return this.props.auth
      .signin(payload)
      .then(refresh_request => {
        this.setStateAndPersist({
          isLoading: false,
          auth: {
            ...this.state.auth,
            refresh_request
          }
        });
        return Promise.resolve(refresh_request);
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error
        });
        return Promise.reject(error);
      });
  }

  signin(payload) {
    //we need to reset auth state first before we try this
    this.setStateAndPersist({
      isVerified: false,
      error: null,
      auth: this.initialState.auth
    });
    return this._signin(payload);
  }

  buildSigninPayload({ username, password }) {
    return {
      username,
      password
    };
  }

  signout() {
    return this.props.auth
      .signout(this.state.auth.access_token)
      .then(() => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error: null,
          auth: this.initialState.auth
        });
        return Promise.resolve();
      })
      .catch(error => {
        // no signout method on the server currently
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error: null,
          auth: this.initialState.auth
        });
        return Promise.resolve();
        /*this.setState({
          isLoading: false,
          error
        });
        return Promise.reject(error);*/
      });
  }

  getLoginUrl(return_url) {
    return this.props.auth.getLoginUrl(return_url);
  }

  login() {
    //console.log(this.getLoginUrl());    // window.location.href = this.getLoginUrl();
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

AuthProvider.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired,
  children: PropTypes.node.isRequired,
  store: PropTypes.shape({
    remove: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired
  }),
  store_key: PropTypes.string
};

AuthProvider.defaultProps = {
  store_key: "__VIBES_AUTH__",
  store
};

export default AuthProvider;