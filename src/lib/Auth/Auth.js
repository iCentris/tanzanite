import jwt from "jsonwebtoken";
import format from "string-template";
import urlencode from "urlencode";
// import fetch from "isomorphic-fetch";

class Auth {
  constructor({ auth_url, login_url, refresh_request_expires_in }) {
    this.auth_url = auth_url;
    this.login_url =
      login_url || "/login?signin_url={signin_url}&return_url={return_url}";
    this.refresh_request_expires_in = refresh_request_expires_in || 60 * 15;
  }

  getAuthUrl(path) {
    return this.auth_url + path;
  }

  quickReject(error) {
    return Promise.resolve(error).then(error => Promise.reject(error));
  }

  fetchWrap({ url, options }) {
    return fetch(url, options)
      .then(response =>
        response.json().then(json => Promise.resolve({ response, data: json }))
      )
      .then(
        payload =>
          payload.response.ok
            ? Promise.resolve(payload)
            : Promise.reject(payload)
      );
  }

  getAuthorizationHeader(access_token) {
    return {
      authorization: "Bearer " + access_token
    };
  }

  getVerifyAccessTokenUrl() {
    return this.getAuthUrl("/access");
  }

  verifyAccessToken(access_token) {
    //quick reject if no access token
    if (!access_token) return this.quickReject(Error("verifyAccessToken"));

    const fetchPayload = {
      url: this.getVerifyAccessTokenUrl(),
      options: {
        method: "GET",
        credentials: "omit",
        headers: {
          ...this.getAuthorizationHeader(access_token)
        }
      }
    };

    return this.fetchWrap(fetchPayload)
      .then(() => Promise.resolve())
      .catch(() => Promise.reject(Error("verifyAccessTokenError")));
  }

  getRefreshAccessTokenUrl() {
    return this.getAuthUrl("/refresh");
  }

  refreshAccessToken(refresh_request) {
    //quick reject if missing refresh params
    if (!refresh_request || !refresh_request.sec)
      return this.quickReject(Error("QUICKrefreshAccessToken"));

    const payload = {
      url: this.getRefreshAccessTokenUrl(),
      options: {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: this.getRefreshRequestJWT(refresh_request)
        })
      }
    };

    return this.fetchWrap(payload)
      .then(({ data: { access_token } }) => Promise.resolve(access_token))
      .catch(() => Promise.reject(Error("refreshAccessTokenError")));
  }

  getSigninUrl() {
    return this.getAuthUrl("/signin");
  }

  signin(payload) {
    const fetchPayload = {
      url: this.getSigninUrl(),
      options: {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    };

    return this.fetchWrap(fetchPayload)
      .then(({ data: refresh_request }) => Promise.resolve(refresh_request))
      .catch(() => Promise.reject(Error("signinError")));
  }

  getSignoutUrl() {
    return this.getAuthUrl("/signout");
  }

  signout(access_token) {
    const payload = {
      url: this.getAuthUrl("/signout"),
      options: {
        method: "DELETE",
        credentials: "omit",
        headers: {
          ...this.getAuthorizationHeader(access_token)
        }
      }
    };

    return this.fetchWrap(payload);
  }

  getRefresh_request_expires_in() {
    return this.refresh_request_expires_in;
  }

  getRefreshRequestJWT({ aud, sub, sec }) {
    const refreshRequestJWT = jwt.sign(
      {
        aud,
        sub
      },
      sec,
      { expiresIn: this.getRefresh_request_expires_in() }
    );

    return refreshRequestJWT;
  }

  getLoginUrl(return_url) {
    return format(this.login_url, {
      return_url: urlencode(return_url),
      signin_url: urlencode(this.getSigninUrl())
    });
  }
}

export default Auth;
