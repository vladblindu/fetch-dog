import React from 'react'
import { HTTP, HttpProvider, useHttp } from 'fetch-dog'
import config from './config/http.config'

const TestComponent = () => {
  const http = useHttp(HTTP)
  const execPost = () =>
    http('http-post')
      .then(res => {
        alert(res.ok)
      })

  return <button
    onClick={execPost}>
    TEST
  </button>
}

const App = () => {

  return <HttpProvider config={config}>
    <TestComponent/>
  </HttpProvider>
}

export default App
