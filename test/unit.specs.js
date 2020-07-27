import * as chai from 'chai'
import fetchDog from '../src'
import { authHeader, callType, checkReturnsJson, isGqlCall, isOriginCall } from '../src/helpers'
import { BASE_URL, DEFAULT_GQL_ENDPOINT, IS_DEFAULT, IS_GQL, IS_ORIGIN } from '../src/constants'

const expect = chai.expect

const DUMMY_TOKEN = 'DUMMY_TOKEN'
const DUMMY_GQL = '{ dummy {query}}'
const DUMMY_ORIGIN = 'origin://locales/ro.json'
const DUMMY_DEFAULT_CALL = 'testEndpoint'

// mock browser environment
// localstorage
global.localStorage = {
  getItem: (key) => key || DUMMY_TOKEN
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

  describe('helpers unit tests', () => {

    it('recognize a json header', () => {
      const testHeaders = {
        'content-type': 'application/json',
        'api-key': 'x-api-key',
        'dummy-header': 'dummy-value'
      }
      expect(checkReturnsJson(testHeaders)).to.be.true
    })

    it('recognize no json header', () => {
      const testHeaders = {
        'content-type': 'text/html',
        'api-key': 'x-api-key',
        'dummy-header': 'dummy-value'
      }
      expect(checkReturnsJson(testHeaders)).to.be.false
    })

    describe('isGqlCall', () => {

      it('should recognize a gql call', () => {
        expect(isGqlCall(DUMMY_GQL)).to.be.true
      })

      it('should recognize a non gql call', () => {
        expect(isGqlCall('http://localhost:3003/test-endpoint')).to.be.false
      })
    })

    describe('isOriginCall', () => {

      it('should recognize a origin call', () => {
        expect(isOriginCall(DUMMY_ORIGIN)).to.be.true
      })

      it('should recognize a non gql call', () => {
        expect(isOriginCall(DUMMY_DEFAULT_CALL)).to.be.false
      })
    })

    describe('authHeader', () => {

      it('should get the right authorization header', () => {
        expect(authHeader({})).to.deep.equal({
          Authorization: `Bearer ${DUMMY_TOKEN}`
        })
      })

      it('should get the right authorization header with custom key', () => {
        const CUSTOM_KEY = 'CUSTOM_KEY'
        expect(authHeader({ tokenKey: CUSTOM_KEY })).to.deep.equal({
          Authorization: `Bearer ${CUSTOM_KEY}`
        })
      })
    })
    describe('callType', () => {

      it('should return IS_GQL', () => {
        expect(callType(DUMMY_GQL)).to.equal(IS_GQL)
      })

      it('should return IS_ORIGIN', () => {
        expect(callType(DUMMY_ORIGIN)).to.equal(IS_ORIGIN)
      })

      it('should return IS_DEFAULT', () => {
        expect(callType(DUMMY_DEFAULT_CALL)).to.equal(IS_DEFAULT)
      })
    })

    describe('execCall', () => {

      const dummyHttpAgent = (ep, py, m, prm) => {
        console.log(ep, py, m, prm)
      }

      it('should place a gql call', () => {
        expect(execCall()).to
      })
    })
  })

  describe('global unit tests', () => {
    const testConfig = {
      baseUrl: 'http://localhost:3003',
      baseHeaders: {},
      endpoints: {
        [DUMMY_DEFAULT_CALL]: {
          url: 'test-endpoint',
          method: 'POST',
          auth: true,
          headers: { ContentType: 'Application/json' }
        },
        gqlEndpoint: {
          url: '/graphql'
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
})
