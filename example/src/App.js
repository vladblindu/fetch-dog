import React from 'react'

import fetchDog from 'fetch-dog'
import { HttpProvider } from '../../src'

const httpAgent = fetchDog({
  endpoints: {}
})

const App = () => {

  return <HttpProvider config={}>
    <TestComponent/>
  </HttpProvider>
}

export default App
