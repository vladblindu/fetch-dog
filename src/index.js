import React from 'react'
import { callType, execCall, fatality, setHttpAgent, setParams } from './helpers'
import { IS_DEFAULT, IS_GQL, IS_ORIGIN } from './constants'

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
 * @name useOrigin
 * @description specific get files from public origin
 * @param {config} config
 * @returns {function(*=): *}
 */
export const useGql = (config) => (query) => {
  const callParams = setParams(config)[IS_GQL]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(query)
  )
}

/**
 * @name useOrigin
 * @description specific get files from public origin
 * @param {config} config
 * @returns {function(*=): *}
 */
export const useOrigin = (config) => (url) => {
  const callParams = setParams(config)[IS_ORIGIN]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(url)
  )
}

/**
 * @name useHttp
 * @description makes a http call
 * @param {config} config
 * @returns {function(*=): *}
 */
export const useHttp = (config) => (endpointName, payload, method, param) => {
  const callParams = setParams(config)[IS_DEFAULT]
  return execCall(
    setHttpAgent(config) || fatality('No fetch available and no other http agent provided. Fatal error.'),
    callParams(endpointName, payload, method, param)
  )
}
