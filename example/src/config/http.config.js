const httpConfig = {
  endpoints: {
    gqlEndpoint: {},
    'http-post': { method: 'POST' }
  },
  errorPages: {
    404: '/404',
    403: '/403',
    500: '/500',
    503: '/503',
    509: '/509',
    default: '/509'
  },
  baseUrl: 'http://localhost:3003',
  baseHeaders: {
    'content-type': 'application/json'
  }
}

export default httpConfig
