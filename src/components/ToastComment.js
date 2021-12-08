import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import Comments from './Comments' 
import commentService from '../services/comments'  
import reactStringReplace from 'react-string-replace'



const ToastComment = ({post, i, currentUser, users, comments, updateCommentHandler, freshPostHandler, likePost, deletePost, checkLike, checkOwned})   => {

    useEffect(() => {
        updateCommentHandler(comments)
     }, [])

    const [commentText, setCommentText] = useState('')

    const postComments = comments.filter(c => c.commentOn === post.id) 

    const addComment = (event) => {
        event.preventDefault()

        const commentObject = {
            content:commentText, 
            post: post.id  
        }

        commentService.create(commentObject, currentUser)
        .then(returnedComment => {
            console.log(returnedComment)
            let regexComment = returnedComment
            let regexText = reactStringReplace(regexComment.content, /@(\w+)/g, (match, i) => (
                (users.filter(u => u.id === match).length > 0) ? <strong><Link key={match + i} to={`/users/${match}`} style={{ color: 'blue' }}>@{match}</Link></strong> : <span key={match + i}>@{match}</span>
            ))
            regexComment.content = regexText

            const updatedComments= comments.reverse().concat(regexComment).reverse()
            
            updateCommentHandler(updatedComments)
                
            setCommentText('')

        })
        .catch(error => {
            alert(
                `Content field cannot be empty`
            )
        })
    }

    return(
        <div className="w-100">
            <div key={i} className="toast w-100 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                <div className="w-33">
                    <Link to={`/u/${post.user}`} className="d-flex align-items-center">
                        {(users.filter(u => u.id === post.user)).map((user, j) => 
                            <div className="d-flex align-items-center">
                                <img key={j} className="postProfileImage" src={user.avatar} alt="avatar" />
                                <div className="d-flex flex-column">
                                    <h5 className="mr-2 mb-0">{user.displayName}</h5><span>u/{user.id}</span>
                                </div>
                            </div>
                        )}
                    </Link>
                </div>
                <div className="w-33 text-center">
                    {(post.board) ?            
                        <Link to={`/b/${post.board}`}>
                            <span>b/{post.board}</span>
                        </Link>
                    :null}
                </div>
                <div className="w-33 d-flex justify-content-end">
                    {(checkOwned(post)) ?
                        <button type="button" className="ml-2 mb-1 close" onClick={() => deletePost(post.id)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    :
                        null
                    }
                </div>   
                </div>
                <div className="toast-body">
                    <p>{post.content}</p>
                </div>
                <div className="toast-header">
                    <div className="d-flex align-items-center">
                        {(currentUser) ? 
                            <button type="button" className={(checkLike(post)) ? "btn btn-danger" : "btn btn-primary"} onClick={() => likePost(post)}>
                                <span aria-hidden="true">{(checkLike(post)) ? "Dislike" : "Like"}</span>
                            </button>
                        :
                            <button type="button" className="btn btn-secondary disabled">
                                <span aria-hidden="true">Like</span>
                            </button>
                        }
                    <strong className="ml-2">Likes: {post.likes.length}</strong>
                    </div>
                    <em>{post.timestamp}</em>
                    <div className="d-flex align-items-center">
                        <strong className="mr-2">Replies: {postComments.length}</strong>
                                   
                    </div>
                </div>
            </div> 
            <h4>Replies</h4>
            {currentUser ? 
                <div className="postFormContainer w-100">
                  <h5>Reply to this post</h5>
                  <form onSubmit={addComment}>
                      <div className="input-group flex-column align-items-end">
                          <textarea type="text" className="form-control postContent w-100 mr-0 mb-2" placeholder="Reply..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                          <button type="submit" className="btn btn-primary">Reply</button>
                      </div>
                  </form> 
              </div> 
            : 
            <div className="toast w-100 mt-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-body">
                    <strong>You must log in to reply to a post</strong>
                </div> 
            </div>
            }
            <div className="w-100">
                <Comments post={post} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler}/>
            </div>
        </div>
    )
}

export default ToastComment
