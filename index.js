const express = require('express')
const app = express()

let persons = 
    [
          {
            "name": "Tom Hanks",
            "number": "12345678",
            "id": 1
          },
          {
            "name": "Tom Cruise",
            "number": "98453290",
            "id": 2
          }
    ]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
      
app.get('/persons', (req, res) => {
    res.json(persons)
})
      
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// console.log("Welcome to Phonebook Server")

// const http = require('http')

// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   console.log("Request recd at ", new Date())
//   res.end('Hello World')
// })

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

// const port = 3001
// app.listen(port)
// console.log(`Server running on port ${port}`)