import React from 'react'

import fetchDog from 'fetch-dog'

const httpAgent = fetchDog({
  endpoints: {}
})

const App = () => {

  const [testValue, setTestValue] = React.useState('waiting')

  React.useEffect(
    () => {
      httpAgent('origin://test.json')
        .then(res => res.json())
        .then(res => {
          setTestValue(res['testKey'])
        })
        .catch(e => {
          console.log(e.message)
        })
    }
  )

  return <div>{testValue}</div>
}

export default App
