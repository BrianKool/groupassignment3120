/*
* @jest-environment jsdom
*/
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import fs from 'fs'
import { timeStamp } from 'console'
import Posts from './components/Posts'
import postService from '../services/posts'  

/**
* Read sample data for testing
* 
* @param {String} fileName JSON data filename
* @returns {Array} an array of like records
*/
const sampleData =  (fileName) => {
 const rawData = fs.readFileSync(fileName)
 const data = JSON.parse(rawData)

 return data.posts
}

describe("Post", () => {
    timeStamp('renders content', () => {
        const contents = sampleData('server/sampledata.json')
        


        const component = render(
            <Post posts={posts} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} />
        )
    
})

})