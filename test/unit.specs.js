import * as chai from 'chai'
import fetchDog from '../src'
import { BASE_URL, DEFAULT_GQL_ENDPOINT } from '../src/constants'

const expect = chai.expect

// mock browser environment
// localstorage
global.localStorage = {
  getItem: () => 'DUMMY_TOKEN'
}
// window
global.window = {
  location: {
    protocol: 'http:',
    host: 'localhost:3000'
  },
  fetch: (url, payload) => (payload ? [url, payload] : url)
}

describe('fetch-dog unit test suite', () => {
  const testConfig = {
    endpoints: {
      testEndpoint: {
        url: 'test-endpoint',
        method: 'POST',
        auth: true,
        headers: { ContentType: 'Application/json' }
      }
    }
  }

  const httpAgent = fetchDog(testConfig)

  it('Should place a gql call', () => {
    const testQuery = '{dummy query}'
    expect(httpAgent(testQuery)).to.deep.equal([
      `${BASE_URL}${DEFAULT_GQL_ENDPOINT.url}`,
      {
        headers: {
          Authorization: 'bearer DUMMY_TOKEN',
          'Accept-Encoding': 'gzip'
        },
        method: DEFAULT_GQL_ENDPOINT.gqlMethod,
        body: testQuery
      }
    ])
  })

  it('Should place an origin call', () => {
    const testQuery = 'origin://locales/en.json'
    expect(httpAgent(testQuery)).to.deep.equal([
      'http://localhost:3000/locales/en.json',
      {
        headers: {},
        method: 'GET',
        body: null
      }
    ])
  })

  it('Should place a standard http call', () => {
    // eslint-disable-next-line no-unused-vars
    const testEndpoint = 'testEndpoint'
    expect(
      httpAgent(testEndpoint, { payload: {} }, 'PUT', '?id=12345')
    ).to.deep.equal([
      `${BASE_URL}/test-endpoint?id=12345`,
      {
        headers: {
          Authorization: 'bearer DUMMY_TOKEN',
          ContentType: 'Application/json'
        },
        method: 'PUT',
        body: JSON.stringify({ payload: {} })
      }
    ])
  })
})
