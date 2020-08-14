import React from 'react'
import { HTTP, HttpProvider, useHttp } from 'fetch-dog'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import config from './config/http.config'
import './App.css'


config.redirect = rdr => {
  alert('REDIRECTING TO: ' + rdr)
}

const TestComponent = () => {
  const http = useHttp(HTTP)
  const execPost = () =>
    http('http-post')
      .then(res => {
        alert(res.ok)
      })

  const execGet = () =>
    http('http-get')
      .then(res => {
        alert(res.ok)
      })

  return <div>
    <button
      onClick={execPost}>
      POST
    </button>
    <button
      onClick={execGet}>
      GET
    </button>

    {Object.keys(config.errorPages).map(
      pg => <button
        key={pg}
        onClick={() => {
          http(pg)
            .then(() => {
            })
        }}>
        {`E${pg}`}
      </button>
    )}
  </div>
}

const App = () => {

  return <Router>
    <HttpProvider config={config}>
      <TestComponent/>
      <Switch>
        {
          Object.keys(config.errorPages).map(
            pg =>
              <Route
                path={`/${pg}`}
                key={pg}
                render={() =>
                  <div className='page'>
                    {`ERROR PAGE ${pg}`}
                  </div>}/>
          )
        }
      </Switch>
    </HttpProvider>
  </Router>
}

export default App
