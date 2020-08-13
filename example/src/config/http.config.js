const httpConfig = {
  endpoints: {
    gqlEndpoint: {},
    'http-post': { method: 'POST' }
  },
  baseUrl: 'http://localhost:3003',
  baseHeaders: {
    'content-type': 'application/json'
  }
}

export default httpConfig
