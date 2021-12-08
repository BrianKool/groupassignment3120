const mongoose = require('mongoose')
const supertest = require('supertest')
const fs = require('fs')
const app = require('../app')
const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");
const Board = require("../models/boards");
const SECRET = process.env.SECRET;

const api = supertest(app)

// load sample data into  database for testing
const sampleData = (fileName) => {
    const rawData = fs.readFileSync(fileName)
    const data = JSON.parse(rawData)

    data.posts.map(async data => {
        const post = new Post(data)
        await post.save()
    })

    data.users.map(async data => {
        const user = new User(data)
        await user.save()
    })
    }

    describe('api', () => {

        beforeEach(async () => {
            sampleData("server/sampledata.json")
        })

        //////////////
        //posts test//
        //////////////
        test('get Post request returns JSON', async () => {
            await api.get('/api/posts')
                     .expect(200)
                     .expect('content-Type', /application\/json/)
        })

        test('there are one-hundred posts datas', async () => {
            const response = await api.get('/api/posts')
            expect(response.body).toHaveLength(100)
        })

        test('get first post by id and returns correct post', async () => {
            const response = await api.get('/api/posts')
            const post = response.body[0]
            await api.get('/api/posts/post/' + post.id)
                     .expect(200)
                     .expect('Content-Type', /application\/json/)
                     .expect(post)  // correct content
        })

        test('post request adds a post', async () => {
            const newPost = {
                content: "test content"
            }
    
            await api.post('/api/posts')
                     .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkJvYmFsb29iYSIsImlhdCI6MTYwMzM3NDEzMX0.dOcr2URS0rTS5kfgfv4WeCkGPSnQduHcUA_MwFSqYRg')
                     .send(newPost)
                     .expect(200)
                     .expect('Content-Type', /application\/json/)
    
            const response = await api.get('/api/posts')
            expect(response.body).toHaveLength(101)
    
        })

        test('update likes for post by specific id', async () => {
            const response = await api.get('/api/posts')
            const post = response.body[0]
            const postObject = {
                id:post.id,
                content: post.content,
                likes: post.likes.concat("Bean")
            }
            const config = {headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkJlYW4iLCJpYXQiOjE2MDM2MzUxMTB9.Pd0pWdYZ0vgejVo5Q8iKgQFUa040t7X6TgEB7DQQWFI" }  }
            await api.put('/api/posts/' + postObject.id, postObject, config)
                     .send(postObject)
                     .then(result => {
                        expect(result.body.likes).toHaveLength(5)  // correct content
                     })
        })

        test('delete post by specific id', async () => {

            const config = {headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkJlYW4iLCJpYXQiOjE2MDM1NjI2NjZ9.YifDggMS4SjYKT1_SUyUBb5DoT2eR0IxqS8cMXUoVR8" }  }
            await api.delete('/api/posts/' + "5f90d9a61ec7c231b0897783", config)
            .expect(204)
        })

        ////////////////
        //Comment Test//
        ////////////////

        //////////////
        //User Test//
        /////////////
        test('get User request returns JSON', async () => {
            await api.get('/api/users')
                     .expect(200)
                     .expect('content-Type', /application\/json/)
        })

        test('there are one-hundred posts datas', async () => {
            const response = await api.get('/api/users')
            expect(response.body).toHaveLength(6)
        })

        test('Register new User and check the total of the users', async () => {
            const newUser = {
                username: 'Chicken',
                password: 'chicken'
            }

            await api.post('/api/register')
                     .send(newUser)
            
            const response = await api.get('/api/users')
            expect(response.body).toHaveLength(7)

        })

        test('Edit user profile detail', async () => {
            const Profile = {
                follows: 'Mandible',
                bio: 'My nmae is pig',
                subscriptions: 'Barfoo',
                displayName: 'KoalaKool',
                gender: 'Male',
            }
            await api.put('/api/users/' + 'Bean')
            .send(Profile)

            const response = await api.get('/api/users')
            console.log("the response.body[3]: ",response.body[3])


        })
        
        
        //////////////
        //Login Test//
        //////////////
        test('login works with correct username/password', async () => {

            const data = {
                username: 'Bobalooba',
                password: 'bob'
            }

            await api.post('/api/login')
                     .send(data)
                     .expect(200)
        })

        test('login fails with incorrect password', async () => {

            const data = {
                username: 'Bobalooba',
                password: 'notbob'
            }
    
            await api.post('/api/login')
                     .send(data)
                     .expect(401)
    
        })

        test('login fails with incorrect username', async () => {

            const data = {
                username: 'notBobalooba',
                password: 'notbob'
            }
    
            await api.post('/api/login')
                     .send(data)
                     .expect(401)
        })



        afterEach(async () => {
            await Post.deleteMany({})
            await User.deleteMany({})
        })

        afterAll(() => {
            mongoose.connection.close()
        })

    }) 