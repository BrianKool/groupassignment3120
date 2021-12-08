import React from 'react'
import {Link} from 'react-router-dom'
import {useParams} from 'react-router-dom'
import postService from '../services/posts'  
import ToastComment from '../components/ToastComment' 

import reactStringReplace from 'react-string-replace'



const Post = ({ posts, currentUser, users, comments, updateCommentHandler, updatePostHandler, freshPostHandler }) => {
    
    const postID = useParams().id

    const post = posts.find(p => p.id === postID)

    //if the current user's id exists in the post's likes array return "liked", else return null
    const checkLike = (post) => {
        if(post.likes.filter(l => l === currentUser.id).length > 0 ){
            return "liked"
        }
        return null
    }

    //if the current user's id is the same as the post's user field return "owned", else return null
    const checkOwned = (post) =>{
        if(currentUser){
            if(currentUser.id === post.user){
                return "owned"
            }
        }
        return null
    }

    const deletePost = (postID) => {
        postService.remove(postID,currentUser)
        .then(returnedPost => { 
            updatePostHandler(posts.filter(p => p.id !== postID))
        })
        .catch(error => {
            alert(
                `the post was already deleted from the server`
            )
        })
    }

    const likePost = (post) => { 
        let postObject       
        if(checkLike(post)){
            postObject = {
                id:post.id,
                content: post.content,
                likes: post.likes.filter(l => l !== currentUser.id) //Remove the user's ID from likes 
            }
        }
        else{
            postObject = {
                id:post.id,
                content: post.content,
                likes: post.likes.concat(currentUser.id) //Add the user's ID from likes 
            }
        }
        postService.update(postObject, currentUser).then(returnedPost => {
            let regexPost = returnedPost
            regexPost.tags = regexPost.content.split(" ").filter(t => t.includes("#"))

            let regexText = reactStringReplace(regexPost.content, /#(\w+)/g, (match, i) => (
                <Link key={match + i} to={`/posts/#${match}`} style={{ color: 'red' }}><button type="button" onClick={() => {freshPostHandler(users)}} ><span>#{match}</span></button></Link>
            ))
            regexText = reactStringReplace(regexText, /@(\w+)/g, (match, i) => (
                (users.filter(u => u.id === match).length > 0) ? <strong><Link key={match + i} to={`/users/${match}`} style={{ color: 'blue' }}>@{match}</Link></strong> : <span>@{match}</span>
            ))

            regexPost.content = regexText

            const newPosts = posts.map(
                post => post.id !== returnedPost.id ? post : regexPost 
            )
            updatePostHandler(newPosts)
        })
      
    }

    if(post){
        return (
          <div className="w-100 row">
            <div className="col-12">
                <h2>
                    Post
                </h2>
                <ToastComment post={post} i={postID} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned}/>  
            </div>
          </div>
        )
    } else {
        return (
            <div className="w-100 row">
                <div className="col-12">
                    <h2>
                        Post
                    </h2>
                    <span>Not Found</span>
                </div>
            </div>
        )
    }
}

export default Post