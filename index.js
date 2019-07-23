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
    Contact.find({}).then(contacts => 
      res.send(`Phonebook has info for ${contacts.length} people <p>${new Date()}`))
})
      
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => res.json(contacts))
})

app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id)
      .then(contact => res.json(contact))
      .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(contact => {
      console.log(`Contact ${contact.name} updated...`)
      res.json(contact)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Contact.findByIdAndDelete(req.params.id)
      .then(contact => res.json(contact))
      .catch(error => console.log(`Error thrown in delete...${error.name}, ${error.message}`))
})
 
app.post('/api/persons', (req, res) => {
    const person = req.body
    console.log(`Name: ${req.body.name}, Number: ${req.body.number}.`)
    // if (!person.hasOwnProperty('name')) {
    //     return res.status(400).json({ 
    //       error: 'Name property not provided!' 
    //     })
    // }

    // if (!person.hasOwnProperty('number')) {
    //     return res.status(400).json({ 
    //       error: 'Number property not provided!' 
    //     })
    // }

    // if (person.name.trim().length === 0) {
    //     return res.status(400).json({ 
    //       error: 'Name cannot be blank!' 
    //     })
    // }

    // if (person.number.toString().trim().length === 0) {
    //     return res.status(400).json({ 
    //       error: 'Number cannot be blank!' 
    //     })
    // }

    // if (persons.find(thisPerson => thisPerson.name == person.name)) {
    //     return response.status(400).json({
    //         error: 'Name already exists in phonebook'
    //     })
    // }

    const contact = new Contact({
      name: req.body.name,
      number: req.body.number
    })
    contact.save()
      .then(newContact => res.json(newContact))
      .catch(error => {
        console.log(`Error thrown in save...${error.name}, ${error.message}`)
        next(error) 
      })
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const setResponse = (response, id) => {
    response.status(404).send(`<h3>No person with ID: ${id} found!</h3>`)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})