import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import postService from '../services/posts'  
import HomePosts from '../components/HomePosts' 
import UserPosts from '../components/UserPosts' 
import TaggedPosts from '../components/TaggedPosts'
import FilterPosts from '../components/FilterPosts'
import BoardPosts from '../components/BoardPosts'

import reactStringReplace from 'react-string-replace'

const Posts = ({currentUser, users, displayUser, displayBoard, posts, comments, updateCommentHandler, updatePostHandler, filter, freshPostHandler})   => {
    
    useEffect(() => {
       updatePostHandler(posts)
    }, [])

    const urlHash = window.location.hash

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
        postService.update(postObject, currentUser)
        .then(returnedPost => {
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


    const commentOnPost = (post) => {

      return null
    }


    return(
        <div className="row">
            <div className="col-12">
                {
                    displayUser ? 
                        <UserPosts currentUser={currentUser} users={users} displayUser={displayUser} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} commentOnPost={commentOnPost} />
                    : 
                    displayBoard ? 
                        <BoardPosts currentUser={currentUser} users={users} displayBoard={displayBoard} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} commentOnPost={commentOnPost}/>
                    :
                    filter === "Home" ? 
                        <HomePosts currentUser={currentUser} users={users} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} commentOnPost={commentOnPost}/>
                    :    
                    urlHash ? 
                        <TaggedPosts currentUser={currentUser} urlHash={urlHash} users={users} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} commentOnPost={commentOnPost}/>
                    :
                    <FilterPosts currentUser={currentUser} users={users} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} commentOnPost={commentOnPost}/>
                }
            </div>
        </div>
    )  
}
export default Posts