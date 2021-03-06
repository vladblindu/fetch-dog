export const TOKEN_KEY = 'token'
export const BASE_URL = 'http://localhost:1337'
export const ORIGIN_URL = 'origin:/'
const DEFAULT_GQL_METHOD = 'POST'
const DEFAULT_GQL_ENDPOINT_URL = '/graphql'

export const DEFAULT_GQL_ENDPOINT = {
  gqlMethod: DEFAULT_GQL_METHOD,
  url: DEFAULT_GQL_ENDPOINT_URL,
  headers: { 'Accept-Encoding': 'gzip' }
}

export const IS_GQL = 2
export const IS_ORIGIN = 1
export const IS_DEFAULT = 0
