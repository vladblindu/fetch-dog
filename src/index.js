import { callType, execCall, fatality, setHttpAgent, setParams } from './helpers'

/**
 * @name fetchDog
 * @description main exported function
 * @param {object} config
 * @param {function?} config.httpAgent
 * @param {function?} config.token
 * @param {string?} config.tokenKey
 * @param {string} config.baseUrl
 * @param.{object} config.endpoints
 * @param {object} config.endpoints.gqlEndpoint
 * @param {object?} config.baseHeaders
 * @returns {(function(*=): function(*=, *=, *=): void)|(function(*=, *=, *=, *=): void)}
 */
const fetchDog = (config) => {

  return (endpointName, payload = {}, method, param) => {
    const callParams = setParams(config)[callType(endpointName)]
    return execCall(
      setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
      callParams(endpointName, payload, method, param)
    )
  }
}

export default fetchDog
