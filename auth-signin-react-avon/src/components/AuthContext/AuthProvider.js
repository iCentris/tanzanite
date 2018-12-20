import React, { Component } from 'react'
import { Provider } from './context'
import store from 'store'
import isEqual from 'lodash.isequal'
import PropTypes from 'prop-types'
import Auth from '../../lib/Auth'

class AuthProvider extends Component {
  constructor (props) {
    super(props)

    this.storeKey = props.storeKey
    this.store = props.store

    this.initialState = {
      initialized: false,
      isLoading: false,
      isVerified: false,
      error: null,
      auth: {
        accessToken: null,
        refreshRequest: {
          sec: null,
          aud: null,
          sub: null
        }
      }
    }

    this.hydrateAuthState = this.hydrateAuthState.bind(this)
    this.setStateAndPersist = this.setStateAndPersist.bind(this)
    this.persistAuthState = this.persistAuthState.bind(this)
    this.getPersistedAuthState = this.getPersistedAuthState.bind(this)
    this.verifyRefreshOrLogin = this.verifyRefreshOrLogin.bind(this)
    this.refreshOrLogin = this.refreshOrLogin.bind(this)
    this.signinAndRefresh = this.signinAndRefresh.bind(this)
    this.verifyAccessToken = this.verifyAccessToken.bind(this)
    this.refreshAccessToken = this.refreshAccessToken.bind(this)
    this.signin = this.signin.bind(this)
    this.signout = this.signout.bind(this)
    this.getLoginUrl = this.getLoginUrl.bind(this)
    this.login = this.login.bind(this)
    this.buildSigninPayload = this.buildSigninPayload.bind(this)

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
    }
  }

  setStateAndPersist (stateChanges) {
    this.setState(stateChanges, this.persistAuthState)
  }

  persistAuthState () {
    // if the state is empty, just delete the key rather than save it
    if (isEqual(this.state.auth, this.initialState.auth)) {
      return this.store.remove(this.storeKey)
    }

    this.store.set(this.storeKey, this.state.auth)
  }

  getPersistedAuthState () {
    const persistedState = this.store.get(this.storeKey)
    return persistedState
  }

  hydrateAuthState (cb) {
    const authState = this.getPersistedAuthState()
    if (!authState) return cb()

    this.setState({ auth: authState }, cb)
  }

  componentDidMount () {
    const cb = () => {
      this.verifyOrRefresh()
        .catch(error => {
          this.setState({
            isVerified: false,
            error
          })
        })
        .finally(() => {
          this.setState({
            initialized: true,
            isLoading: false
          })
        })
    }

    this.hydrateAuthState(cb)
  }

  verifyOrRefresh () {
    return this.verifyAccessToken().catch(() => this.refreshAccessToken())
  }

  verifyRefreshOrLogin () {
    return this.verifyAccessToken().catch(() => this.refreshOrLogin())
  }

  refreshOrLogin () {
    return this.refreshAccessToken().catch(() => this.login())
  }

  signinAndRefresh (payload) {
    return this.signin(payload).then(() => this.refreshAccessToken())
  }

  verifyAccessToken () {
    return this.props.auth
      .verifyAccessToken(this.state.auth.accessToken)
      .then(() => {
        this.setState({
          isLoading: false,
          isVerified: true,
          error: null
        })
        return Promise.resolve()
      })
      .catch(error => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error,
          auth: {
            ...this.state.auth,
            accessToken: null
          }
        })
        return Promise.reject(error)
      })
  }

  refreshAccessToken () {
    return this.props.auth
      .refreshAccessToken(this.state.auth.refreshRequest)
      .then(accessToken => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: true,
          error: null,
          auth: {
            ...this.state.auth,
            accessToken
          }
        })
        return Promise.resolve(accessToken)
      })
      .catch(error => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error,
          auth: {
            ...this.state.auth,
            refreshRequest: this.initialState.refreshRequest
          }
        })
        return Promise.reject(error)
      })
  }

  _signin (payload) {
    return this.props.auth
      .signin(payload)
      .then(refreshRequest => {
        this.setStateAndPersist({
          isLoading: false,
          auth: {
            ...this.state.auth,
            refreshRequest
          }
        })
        return Promise.resolve(refreshRequest)
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error
        })
        return Promise.reject(error)
      })
  }

  signin (payload) {
    // we need to reset auth state first before we try this
    this.setStateAndPersist({
      isVerified: false,
      error: null,
      auth: this.initialState.auth
    })
    return this._signin(payload)
  }

  buildSigninPayload ({ username, password }) {
    return {
      username,
      password
    }
  }

  signout () {
    return this.props.auth
      .signout(this.state.auth.accessToken)
      .then(() => {
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error: null,
          auth: this.initialState.auth
        })
        return Promise.resolve()
      })
      .catch(() => {
        // no signout method on the server currently
        this.setStateAndPersist({
          isLoading: false,
          isVerified: false,
          error: null,
          auth: this.initialState.auth
        })
        return Promise.resolve()
        /* this.setState({
          isLoading: false,
          error
        });
        return Promise.reject(error); */
      })
  }

  getLoginUrl (returnUrl) {
    return this.props.auth.getLoginUrl(returnUrl)
  }

  login () {
    // console.log(this.getLoginUrl());    // window.location.href = this.getLoginUrl();
  }

  render () {
    return <Provider value={this.state}>{this.props.children}</Provider>
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
  storeKey: PropTypes.string
}

AuthProvider.defaultProps = {
  storeKey: '__VIBES_AUTH__',
  store
}

export default AuthProvider
