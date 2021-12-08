require("dotenv").config()
const mongoose = require("mongoose")
const Post = require("./models/posts")
const User = require("./models/users")
const fs = require("fs")
const bcrypt = require('bcrypt')


// load data from JSON file into memory
const rawData = fs.readFileSync("server/sampledata.json")
const data = JSON.parse(rawData)

data.posts.map(record => {
    console.log(record)
    const newPost = new Post({
        id: record.id,
        user: record.user,
        timestamp: record.timestamp,
        content: record.content,
        likes: record.likes,
        tags: []
    })

    newPost.save().then(result => {
        console.log("post record saved")
    })
})

data.users.map(record => {
    const newUser = new User({
        id: record.id,
        password: record.password,
        avatar: 'https://robohash.org/' + record.id,
        follows: record.follows,       
        bio: record.id + " has not entered a bio." 
    })

    newUser.save().then(result => {
        console.log("user record saved")
    })

})


//mongoose.connection.close()