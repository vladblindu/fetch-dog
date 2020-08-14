const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.options('*', cors())

app.post('/http-post', (req, res) => {
  res.json({ ok: 'Post request successful' })
})

app.get('/http-get', (req, res) => {
  res.json({ ok: 'Get request successful' })
})

app.get('*', (req, res) => {
  res.status(req.url.replace('/', '')).json({ ok: req.url })
})

const server = app.listen(3003, () => {
  console.log('Mock server listening on 3003.')
})

module.exports = server.close
