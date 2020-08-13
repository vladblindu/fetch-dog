import React from 'react'
import { callType, execCall, fatality, setHttpAgent, setParams } from './helpers'
export { IS_DEFAULT, IS_GQL, IS_ORIGIN, ORIGIN, GQL, HTTP } from './constants'

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
    )
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
  )
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
  )
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
  )
}

/**
 * @param config
 * @returns {function(*)}
 */
const redirector = config => res => {
  if (res.ok) return res
  if (!res.error) res.error = true
  config.redirect(config.errorPages[res.status])
  return res
}

const HttpContext = React.createContext({})

export const HttpProvider = ({ config, children }) => {

  const value = {
    gql: fetchDogGql.then(redirector(config)),
    http: fetchDogHttp.then(redirector(config)),
    origin: fetchDogOrigin.then(redirector(config))
  }

  return <HttpContext.Provider value={value}>
    {children}
  </HttpContext.Provider>
}

export const useHttp = callType => {
  const context = React.useContext(HttpContext)
  const httpAgent = context[callType]
  if (!httpAgent) throw new Error('DEVERR: Wrong callType argument provided to useHttp hook.')
  return httpAgent
}

