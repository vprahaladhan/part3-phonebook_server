const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://admin:${password}@learn-mern-stack-nreww.gcp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv[3] && process.argv[4]) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    contact.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Contact.find({}).then(result => {
        result.forEach(contact => console.log(contact))
        mongoose.connection.close()
    })
}