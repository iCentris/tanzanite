import React, { Component } from 'react'
import querystring from 'query-string'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class ProcessSignout extends Component {
  constructor (props) {
    super(props)

    this.initialState = {
      initialized: false,
      isSuccess: false,
      returnUrl: '/',
      error: null
    }

    this.state = this.initialState

    this.retrieveReturnUrl = this.retrieveReturnUrl.bind(this)
  }

  retrieveReturnUrl (search) {
    return querystring.parse(search).payload || this.state.returnUrl
  }

  componentDidMount () {
    Promise.resolve()
      .then(() => {
        const returnUrl = this.retrieveReturnUrl(this.props.location.search)
        this.setState({
          returnUrl
        })
      })
      .then(() => {
        return this.props.auth.signout().then(() => {
          this.setState({
            initialized: true,
            isSuccess: true,
            error: null
          })
        })
      })
      .catch(error => {
        // signout isn't implemented yet server side
        this.setState({
          initialized: true,
          isSuccess: false,
          error
        })
      })
  }

  render () {
    const { initialized, isSuccess, returnUrl, error } = this.state
    if (!initialized) return <div>Processing signout request...</div>
    if (!isSuccess) {
      return (
        <div>
          We're sorry, but we were unable to signout because:
          {error.message}
        </div>
      )
    }

    return (
      <div>
        Congratulations, signout was successful.
        <br />
        <Link to={returnUrl}>
          <button>Go to Return URL</button>
        </Link>
      </div>
    )
  }
}

ProcessSignout.propTypes = {
  auth: PropTypes.shape({
    signout: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  })
}

ProcessSignout.defaultProps = {
  location: {
    search: null
  }
}

export default ProcessSignout
