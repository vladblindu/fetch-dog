/**
 * @typef {object} gqlEndpoint
 * @param {string} gqlEndpoint.url
 * @param {string} gqlEndpoint.gqlMethod
 * @param {object} gqlEndpoint.headers
 */

/**
 * @typedef {object} cfg
 * @param {string?} config.tokenKey
 * @param {string?} config.baseUrl
 * @param {object} config.endpoints
 * @param {gqlEndpoint} config.endpoints.gqlEndpoint
 * @param {object?} baseHeaders
 */

import { BASE_URL, DEFAULT_GQL_ENDPOINT, ORIGIN, TOKEN_KEY } from './constants'
import urlJoin from 'url-join'

/**
 * @param {cfg} config
 * @param {boolean?} HOOK
 * @returns {(function(...[*]=))|(function(*): function(*=, *=, *=): Promise<Response>)}
 */

const fetchDog = (config, HOOK = false) => {
  if (!window.fetch)
    throw new Error(
      'No fetch protocol available on the window instance. Fatal error.'
    )
  // set the fetch verb
  const httpAgent = window.fetch
  // set the base api url
  const baseUrl = config.baseUrl || BASE_URL
  // set the app's origin url
  const webOrigin = window.location.protocol + '//' + window.location.host
  // set the local storage
  const getToken = () => localStorage.getItem(config.tokenKey || TOKEN_KEY)
  // set the graphql endpoint
  const gqlEndpoint = {
    ...DEFAULT_GQL_ENDPOINT,
    ...config.endpoints.gqlEndpoint
  }
  // set the baseHeaders
  const baseHeaders = config.baseHeaders || {}
  // set the authenticated header
  const authHeader = () => {
    return { Authorization: `bearer ${getToken()}` }
  }
  // set the auto graphql detector
  const isGqlCall = (inStr) => /[{}]$/g.test(inStr)
  // set the auto web origin detector
  const isOriginCall = (inStr) => inStr.startsWith(ORIGIN)

  let httpParams

  const gqlParams = (payload) => ({
    url: urlJoin(baseUrl, gqlEndpoint.url),
    method: gqlEndpoint.gqlMethod,
    body: payload,
    headers: {
      ...baseHeaders,
      ...authHeader(),
      ...gqlEndpoint.headers
    }
  })

  const originParams = (url) => ({
    url: url,
    method: 'GET',
    headers: baseHeaders,
    body: null
  })

  const endpointParam = (endpointName, payload, _method, param) => {
    const endpoint = config.endpoints[endpointName]
    if (!endpoint) throw new Error(`${endpointName} endpoint is not registered`)
    const url = urlJoin(baseUrl, endpoint.url, param)
    const method = _method || endpoint.method
    const body = JSON.stringify(payload)
    const headers = endpoint.headers
      ? { ...baseHeaders, ...endpoint.headers }
      : baseHeaders
    if (endpoint.auth) headers.Authorization = `bearer ${getToken()}`
    return {
      url,
      headers,
      method,
      body
    }
  }

  if (HOOK)
    return (endpointName) => (payload, method = 'GET', param = '') => {
      switch (endpointName) {
        case 'graphql':
          httpParams = gqlParams(payload)
          break
        case 'origin':
          httpParams = originParams(payload)
          break
        default:
          httpParams = endpointParam(endpointName, payload, method, param)
      }
      return httpAgent(httpParams.url, {
        headers: httpParams.headers,
        method: httpParams.method,
        body: httpParams.body
      })
    }
  else
    return (endpointName, payload = {}, method, param) => {
      if (isGqlCall(endpointName)) {
        httpParams = gqlParams(endpointName)
      } else if (isOriginCall(endpointName)) {
        httpParams = originParams(endpointName.replace(ORIGIN, webOrigin))
      } else httpParams = endpointParam(endpointName, payload, method, param)

      return httpAgent(httpParams.url, {
        headers: httpParams.headers,
        method: httpParams.method,
        body: httpParams.body
      })
    }
}

export default fetchDog
