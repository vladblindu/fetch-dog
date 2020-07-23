export const TOKEN_KEY = 'token'
export const BASE_URL = 'http://localhost:1337'
export const ORIGIN = 'origin:/'
const DEFAULT_GQL_METHOD = 'POST'
const DEFAULT_GQL_ENDPOINT_URL = '/graphql'

export const DEFAULT_GQL_ENDPOINT = {
  gqlMethod: DEFAULT_GQL_METHOD,
  url: DEFAULT_GQL_ENDPOINT_URL,
  headers: { 'Accept-Encoding': 'gzip' }
}
