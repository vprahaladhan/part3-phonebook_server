require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

morgan.token('body', (req, res) => { 
    return JSON.stringify(req.body) == "{}" ? ' ' : `{"name": "${req.body.name}", "number": "${req.body.number}"}`
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

const cors = require('cors')
app.use(cors())

const Contact = require('./models/contact')

app.get('/api', (req, res) => {
    res.send('<h1>Welcome to Server-side Phonebook App!</h1>')
})

app.get('/info', (req, res) => {
    const persons = Contact.find({}).then(contacts => contacts)
    const resString = `Phonebook has info for ${persons.length} people <p>${new Date()}`
    res.send(resString)
})
      
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => res.json(contacts))
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id == req.params.id)

    person ? res.json(person) : setResponse(res, req.params.id)
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id != req.params.id)
    res.status(204).end()
})
 
app.post('/api/persons', (request, response) => {
    let person = request.body
    console.log(`Name: ${person.name}, Number: ${person.number}.`)
    if (!person.hasOwnProperty('name')) {
        return response.status(400).json({ 
          error: 'Name property not provided!' 
        })
    }

    if (!person.hasOwnProperty('number')) {
        return response.status(400).json({ 
          error: 'Number property not provided!' 
        })
    }

    if (person.name.trim().length === 0) {
        return response.status(400).json({ 
          error: 'Name cannot be blank!' 
        })
    }

    if (person.number.toString().trim().length === 0) {
        return response.status(400).json({ 
          error: 'Number cannot be blank!' 
        })
    }

    if (persons.find(thisPerson => thisPerson.name == person.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }

    person.id =  getRandomInt(1000)
    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const setResponse = (response, id) => {
    response.status(404).send(`<h3>No person with ID: ${id} found!</h3>`)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const PORT = process.env.PORT
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