const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.options('*', cors())

app.post('/http-post', (req, res) => {
  res.json({ ok: true })
})

app.get('/http-get', (req, res) => {
  res.json({ ok: true })
})

const server = app.listen(3003, () => {
  console.log('Mock server listening on 3003.')
})

module.exports = server.close
