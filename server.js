const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const prod = process.env.NODE_ENV === 'production'
const app = next({ prod })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
