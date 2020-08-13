import { BASE_URL, DEFAULT_GQL_ENDPOINT, IS_DEFAULT, IS_GQL, IS_ORIGIN, ORIGIN_URL, TOKEN_KEY } from './constants'
import urlJoin from 'url-join'

/**
 *
 * @param {object} params
 * @returns {string}
 */
const encodeGetParams = params =>
  Object.entries(params).map(kv => kv.map(encodeURIComponent).join('=')).join('&')

/**
 * @param {object} e
 */
export const fatality = e => {
  throw new e
}

/**
 * @param {config} config
 * @param {function} config.httpAgent
 * @returns {*}
 */
export const setHttpAgent = (config) =>
  config.httpAgent && typeof config.httpAgent === 'function'
    ? config.httpAgent
    : window.fetch

/**
 * @param {object} headers
 * @returns {boolean}
 */
export const checkReturnsJson = (headers) =>
  !!Object.values(headers).filter((v) => v.toLowerCase() === 'application/json')
    .length

/**
 * @param {config} config
 * @param {function?} config.token
 * @param {string?} config.tokenKey
 * @returns {*}
 */
export const authHeader = (config) => ({
  Authorization: config.token
    ? config.token()
    : 'Bearer ' + localStorage.getItem(config.tokenKey || TOKEN_KEY)
})

/**
 * @param {function} http
 * @param {object} params
 * @param {object} params.headers
 */
export const execCall = (http, { url, headers, ...rest }) =>
  checkReturnsJson(headers)
    ? http(url, { headers, ...rest })
      .then((res) => res.ok ? res.json() : res)
      .catch((e) => {
        throw e
      })
    : http(url, { headers, ...rest })


/**
 * @param {string} url
 * @returns {boolean}
 */
export const isGqlCall = (url) => /[{}]$/g.test(url)

/**
 * @param {string} url
 * @returns {boolean}
 */
export const isOriginCall = (url) => url.startsWith(ORIGIN_URL)

/**
 * @param {string} url
 * @returns {number}
 */
export const callType = (url) =>
  isGqlCall(url) ? IS_GQL : isOriginCall(url) ? IS_ORIGIN : IS_DEFAULT

/**
 * @param {config} config
 * @param {object} config.endpoints.gqlEndpoint
 * @param {object?} config.baseHeaders
 * @returns {[
 * function(url: string, payload:{}, method: string, param: string): {headers: {}, method: *, body: string, url: string},
 * function(url: string): {headers: {}, method: string, body: string | null, url: string},
 * function(url: string): {headers: {}, method: string, body: string, url: string}
 * ]}
 */
export const setParams = config => {
  config.baseUrl = config.baseUrl || BASE_URL
  config.endpoints.gqlEndpoint = {
    ...DEFAULT_GQL_ENDPOINT,
    ...config.endpoints.gqlEndpoint
  }
  // set the app's origin url
  const webOrigin = window.location.protocol + '//' + window.location.host

  return [
    // index 0 - defaultCall
    (endpointName, payload, method, params = '') => {
      const endpoint = config.endpoints[endpointName]
      if (!endpoint) throw new Error(`${endpointName} endpoint is not registered`)
      if (typeof params === 'object')
        params = encodeGetParams(params)
      return {
        url: urlJoin(config.baseUrl, endpoint.url, params),
        headers: {
          ...(config.baseHeaders || {}),
          ...(endpoint.auth ? authHeader(config) : {}),
          ...(endpoint.headers || {})
        },
        method: method || endpoint.method,
        body: JSON.stringify(payload)
      }
    },
    // index 1 - originCall
    (url) => ({
      url: urlJoin(webOrigin, url.replace(ORIGIN_URL, '')),
      method: 'GET',
      headers: {
        ...(config.baseHeaders || {})
      },
      body: null
    }),
    // index 2  - gqlCall
    (url) => ({
      url: urlJoin(config.baseUrl, config.endpoints.gqlEndpoint.url),
      method: config.endpoints.gqlEndpoint.gqlMethod,
      body: url,
      headers: {
        ...(config.baseHeaders || {}),
        ...(config.endpoints.gqlEndpoint.auth === false ? {} : authHeader(config)),
        ...(config.endpoints.gqlEndpoint.headers || {})
      }
    })
  ]
}
