import React from 'react'
import { HttpProvider } from '../../src'


const App = () => {

  return <HttpProvider config={}>
    <TestComponent/>
  </HttpProvider>
}

export default App
