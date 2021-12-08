const mongoose = require('mongoose')

const url = process.env.MONGO_URL

console.log('connecting to ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const commentSchema = new mongoose.Schema({
    content: String,
    user: String,
    commentOn: String,
    timestamp: String
})

commentSchema.set('toJSON', {
transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
}
})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment