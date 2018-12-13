import React, { Component } from 'react'
import querystring from 'query-string'
import PropTypes from 'prop-types'

class ProcessSignin extends Component {
  constructor (props) {
    super(props)

    this.initialState = {
      initialized: false,
      isSuccess: false,
      returnUrl: '/',
      error: null
    }

    this.state = this.initialState

    this.retrieveVars = this.retrieveVars.bind(this)
  }

  retrieveVars (search) {
    const { signinPayload, returnUrl = this.state.returnUrl } = JSON.parse(
      querystring.parse(search).payload
    )
    return { signinPayload, returnUrl }
  }

  componentDidMount () {
    Promise.resolve()
      .then(() => {
        const { signinPayload, returnUrl } = this.retrieveVars(
          this.props.location.search
        )
        if (!signinPayload) return Promise.reject(Error('No signinPayload'))

        this.setState({
          returnUrl
        })

        return signinPayload
      })
      .then((signinPayload) => {
        return this.props.auth.signinAndRefresh(signinPayload).then(() => {
          this.setState({
            initialized: true,
            isSuccess: true,
            error: null
          })
        })
      })
      .catch(error => {
        this.setState({
          initialized: true,
          isSuccess: false,
          error
        })
      })
  }

  render () {
    const { initialized, isSuccess, returnUrl } = this.state
    if (!initialized) return <div>Processing signin request...</div>
    if (!isSuccess) {
      return (
        <div>
          We're sorry, but we were unable to process because:
          {this.state.error.message}
        </div>
      )
    }

    return (
      <div>
        Congratulations, siginin was successful.
        <br />
        <a href={returnUrl}>
          <button>Go to Return URL</button>
        </a>
      </div>
    )
  }
}

ProcessSignin.propTypes = {
  auth: PropTypes.shape({
    signinAndRefresh: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
}

export default ProcessSignin
