const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

console.log(`My message is ${process.env.MONGODB_URI}`)

const url = process.env.MONGODB_URI

console.log('connecting to:::', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  number: {
    type: String,
    unique: true,
    minlength: 8,
    required: true
  }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)