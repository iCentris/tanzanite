import jwt from 'jsonwebtoken'
import format from 'string-template'
import urlencode from 'urlencode'
import formurlencoded from 'form-urlencoded'
// import fetch from "isomorphic-fetch";

class Auth {
  constructor ({ authUrl, loginUrl, refreshRequestExpiresIn }) {
    this.authUrl = authUrl
    this.loginUrl =
      loginUrl || '/login?signin_url={signin_url}&returnUrl={returnUrl}'
    this.refreshRequestExpiresIn = refreshRequestExpiresIn || 60 * 15
  }

  getAuthUrl (path) {
    return this.authUrl + path
  }

  quickReject (error) {
    return Promise.resolve(error).then(error => Promise.reject(error))
  }

  fetchWrap ({ url, options }) {
    options = {
      ...(options || {}),
      credentials: 'omit'
    }
    return fetch(url, options)
      .catch(error => Promise.reject(error))
      .then(response => {
        return response
          .text()
          .then(text => Promise.resolve({ response, text }))
      })
      .then(({ response, text }) => {
        if (!text) text = ''

        let data = {}

        try {
          data = JSON.parse(text)
        } catch (e) {
          data = JSON.parse(JSON.stringify(text))
        }

        const payload = { response, data }
        return response.ok ? Promise.resolve(payload) : Promise.reject(payload)
      })
  }

  getAuthorizationHeader (accessToken) {
    return {
      authorization: format('Bearer {accessToken}', { accessToken })
    }
  }

  getVerifyAccessTokenUrl () {
    return this.getAuthUrl('/access')
  }

  verifyAccessToken (accessToken) {
    // quick reject if no access token
    if (!accessToken) return this.quickReject(Error('verifyAccessToken'))

    const fetchPayload = {
      url: this.getVerifyAccessTokenUrl(),
      options: {
        method: 'GET',
        headers: {
          ...this.getAuthorizationHeader(accessToken)
        }
      }
    }

    return this.fetchWrap(fetchPayload)
      .then(() => Promise.resolve())
      .catch(() => Promise.reject(Error('verifyAccessTokenError')))
  }

  getRefreshAccessTokenUrl () {
    return this.getAuthUrl('/refresh')
  }

  refreshAccessToken (refreshRequest) {
    // quick reject if missing refresh params
    if (!refreshRequest || !refreshRequest.sec) { return this.quickReject(Error('QUICKrefreshAccessToken')) }

    const payload = {
      url: this.getRefreshAccessTokenUrl(),
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formurlencoded({
          client_assertion_type:
            'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
          client_assertion: this.getRefreshRequestJWT(refreshRequest)
        })
      }
    }

    return this.fetchWrap(payload)
      .then(({ data: { accessToken } }) => Promise.resolve(accessToken))
      .catch(() => Promise.reject(Error('refreshAccessTokenError')))
  }

  getSigninUrl () {
    return this.getAuthUrl('/signin')
  }

  signin (payload) {
    const fetchPayload = {
      url: this.getSigninUrl(),
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formurlencoded(payload)
      }
    }

    return this.fetchWrap(fetchPayload)
      .then(({ data: refreshRequest }) => Promise.resolve(refreshRequest))
      .catch(() => Promise.reject(Error('signinError')))
  }

  getSignoutUrl () {
    return this.getAuthUrl('/signout')
  }

  signout (accessToken) {
    const payload = {
      url: this.getAuthUrl('/signout'),
      options: {
        method: 'DELETE',
        headers: {
          ...this.getAuthorizationHeader(accessToken)
        }
      }
    }

    return this.fetchWrap(payload)
      .then(() => Promise.resolve())
      .catch(() => Promise.reject(Error('signoutError')))
  }

  getrefreshRequestExpiresIn () {
    return this.refreshRequestExpiresIn
  }

  getRefreshRequestJWT ({ aud, sub, sec }) {
    const refreshRequestJWT = jwt.sign(
      {
        aud,
        sub
      },
      sec,
      { expiresIn: this.getrefreshRequestExpiresIn() }
    )

    return refreshRequestJWT
  }

  getLoginUrl (returnUrl) {
    return format(this.loginUrl, {
      returnUrl: urlencode(returnUrl),
      signin_url: urlencode(this.getSigninUrl())
    })
  }
}

export default Auth
