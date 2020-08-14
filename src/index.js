import React from 'react'
import { callType, execCall, fatality, setHttpAgent, setParams } from './helpers'
import { IS_DEFAULT, IS_GQL, IS_ORIGIN } from './constants'
import { useHistory } from 'react-router-dom'

export { IS_DEFAULT, IS_GQL, IS_ORIGIN, ORIGIN, GQL, HTTP, DEFAULT_HTTP_METHOD } from './constants'

const hasContent = o => !!Object.keys(o).length

/**
 * @param config
 * @returns {function(*)}
 */
const redirector = config => res => {
  if (res.ok || !(config.redirect && config.errorPages && hasContent(config.errorPages)))
    return res
  if (!res.error) res.error = true
  console.log(config.errorPages)
  config.redirect(config.errorPages[res.status] || config.errorPages.default || '/509')
  return res
}

/**
 * @name fetchDog
 * @description main http function
 * @parma {config} config
 * @returns {(function(*=): function(*=, *=, *=): void)|(function(*=, *=, *=, *=): void)}
 */
export const fetchDog = (config) => {

  return (endpointName, payload = {}, method, param) => {
    const callParams = setParams(config)[callType(endpointName)]
    return execCall(
      setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
      callParams(endpointName, payload, method, param)
    ).then(redirector(config))
  }
}

/**
 * @name fetchDogOrigin
 * @description specific get files from public origin
 * @param {config} config
 * @returns {function(*=): *}
 */
export const fetchDogGql = (config) => (query) => {
  const callParams = setParams(config)[IS_GQL]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(query)
  ).then(redirector)
}

/**
 * @name fetchDogOrigin
 * @description specific get files from public origin
 * @param {config} config
 * @returns {function(*=): *}
 */
export const fetchDogOrigin = (config) => (url) => {
  const callParams = setParams(config)[IS_ORIGIN]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(url)
  ).then(redirector)
}

/**
 * @name fetchDogHttp
 * @description makes a http call
 * @param {config} config
 * @returns {function(*=): *}
 */
export const fetchDogHttp = (config) => (endpointName, payload, method, param) => {
  const callParams = setParams(config)[IS_DEFAULT]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(endpointName, payload, method, param)
  ).then(redirector(config))
}

const HttpContext = React.createContext({})

export const HttpProvider = ({ config, children }) => {

  const history = useHistory()

  config.redirect = history.push
  const value = {
    gql: fetchDogGql(config),
    http: fetchDogHttp(config),
    origin: fetchDogOrigin(config)
  }

  return <HttpContext.Provider value={value}>
    {children}
  </HttpContext.Provider>
}

export const useHttp = callType => {
  const context = React.useContext(HttpContext)
  const httpAgent = context[callType.toLowerCase().trim()]
  if (!httpAgent) throw new Error('DEVERR: Wrong callType argument provided to useHttp hook.')
  return httpAgent
}

