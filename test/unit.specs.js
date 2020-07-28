import * as chai from 'chai'
import fetchDog from '../src'
import { authHeader, callType, checkReturnsJson, execCall, isGqlCall, isOriginCall, setParams } from '../src/helpers'
import { DEFAULT_GQL_ENDPOINT, IS_DEFAULT, IS_GQL, IS_ORIGIN, ORIGIN_URL } from '../src/constants'

const expect = chai.expect

const DUMMY_TOKEN = 'DUMMY_TOKEN'

// mock browser environment
// localstorage
global.localStorage = {
  getItem: (key) => key !== 'token' ? key : DUMMY_TOKEN
}
// window
global.window = {
  location: {
    protocol: 'http:',
    host: 'localhost:3000'
  },
  fetch: (url, payload) => [url, payload]
}

const DUMMY_GQL = '{ dummy {query}}'
const DUMMY_ORIGIN = 'origin://locales/ro.json'
const DUMMY_DEFAULT_CALL = 'testEndpoint'
const DUMMY_LOCAL_HOST = global.window.location.protocol + '//' +
  global.window.location.host
const DUMMY_BASE_URL = 'test-base-url'

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

      it('should place a default call', () => {
        const http = () => 'SUCCESS'
        expect(execCall(http, { headers: { dummyHeader: 'whatever' } }))
          .to.equal('SUCCESS')
      })

      it('should place a call and return the parsed json response', async () => {
        const http = () => Promise.resolve(({ json: () => 'SUCCESS' }))
        const params = { headers: { 'content-type': 'application/json' } }
        expect(await execCall(http, params))
          .to.equal('SUCCESS')
      })
    })

    describe('setParams', () => {

      const testConfig = {
        baseUrl: DUMMY_BASE_URL,
        baseHeaders: {
          'base-header': 'dummy-header'
        },
        endpoints: {
          testEndpoint: {
            url: 'test-endpoint',
            auth: true,
            method: 'POST',
            headers: { 'content-type': 'application/json' }
          },
          gqlEndpoint: {}
        }
      }

      it('should return default call params', () => {
        const params = setParams(testConfig)[0]('testEndpoint', { key: 'value' }, 'PUT', '?id=55')
        expect(params).to.deep.equal({
          body: '{\"key\":\"value\"}',
          headers: {
            'Authorization': `Bearer ${DUMMY_TOKEN}`,
            'base-header': 'dummy-header',
            'content-type': 'application/json'
          },
          method: 'PUT',
          url: `${DUMMY_BASE_URL}/test-endpoint?id=55`
        })
      })

      it('should return default call params, no auth', () => {
        delete testConfig.endpoints.testEndpoint.auth
        const params = setParams(testConfig)[0]('testEndpoint', { key: 'value' }, 'PUT', '?id=55')
        expect(params).to.deep.equal({
          body: '{\"key\":\"value\"}',
          headers: {
            'base-header': 'dummy-header',
            'content-type': 'application/json'
          },
          method: 'PUT',
          url: `${DUMMY_BASE_URL}/test-endpoint?id=55`
        })
      })

      it('should return origin call', () => {
        const params = setParams(testConfig)[1](DUMMY_ORIGIN)
        expect(params).to.deep.equal({
          body: null,
          headers: { 'base-header': 'dummy-header' },
          method: 'GET',
          url: DUMMY_LOCAL_HOST + DUMMY_ORIGIN.replace(ORIGIN_URL, '')
        })

        it('should return a gql call', () => {
          const params = setParams(testConfig)[2](DUMMY_GQL)
          expect(params).to.deep.equal({
            body: DUMMY_GQL,
            headers: {
              'base-header': 'dummy-header',
              'Accept-Encoding': 'gzip',
              'Authorization': 'Bearer token'
            },
            method: 'POST',
            url: `${DUMMY_BASE_URL}/graphql`
          })
        })
      })
    })
  })

  describe('global unit tests', () => {
    const testConfig = {
      baseUrl: 'test-base-url',
      baseHeaders: {
        'base-header': 'dummy-header'
      },
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
      expect(httpAgent(DUMMY_GQL)).to.deep.equal([
        `${DUMMY_BASE_URL}/graphql`,
        {
          headers: {
            'base-header': 'dummy-header',
            'Authorization': `Bearer ${DUMMY_TOKEN}`,
            'Accept-Encoding': 'gzip'
          },
          method: DEFAULT_GQL_ENDPOINT.gqlMethod,
          body: DUMMY_GQL
        }
      ])
    })

    it('Should place an origin call', () => {
      const testQuery = 'origin://locales/en.json'
      expect(httpAgent(testQuery)).to.deep.equal([
        `${DUMMY_LOCAL_HOST}/locales/en.json`,
        {
          headers: {
            'base-header': 'dummy-header'
          },
          method: 'GET',
          body: null
        }
      ])
    })

    it('Should place a standard http call', async () => {
      window.fetch = (url, payload) => Promise.resolve(({ json: () => [url, payload] }))
      expect(
        await httpAgent('testEndpoint', { key: 'value' }, 'PUT', '?id=12345')
      ).to.deep.equal([
        `${DUMMY_BASE_URL}/test-endpoint?id=12345`,
        {
          headers: {
            'base-header': 'dummy-header',
            'Authorization': `Bearer ${DUMMY_TOKEN}`,
            'ContentType': 'Application/json'
          },
          method: 'PUT',
          body: JSON.stringify({ key: 'value' })
        }
      ])
    })
  })
})
