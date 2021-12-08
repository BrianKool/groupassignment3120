import React, { useEffect }  from 'react'
import {Link} from 'react-router-dom'
import commentService from '../services/comments'  
import reactStringReplace from 'react-string-replace'


const Comments = ({post, currentUser, users, comments, updateCommentHandler, freshPostHandler}) => {


    useEffect(() => {
        updateCommentHandler(comments)
    }, [])

    const checkOwned = (comment) =>{
        if(currentUser){
            console.log(currentUser)
            console.log(comment.user)
            if(currentUser.id === comment.user){
                return "owned"
            }
        }
        return null
    }
    const deleteComment = (commentID) => {
        commentService.remove(commentID,currentUser)
        .then(returnedComment => { 
            updateCommentHandler(comments.filter(c => c.id !== commentID))
        })
        .catch(error => {
            alert(
                `the comment was already deleted from the server`
            )
        })
    }

    const currentPostComments = comments.filter(c => c.commentOn === post.id) 

    // Find and replace @mentions in post content
    currentPostComments.map(c => 
        c.content = reactStringReplace(c.content, /@(\w+)/g, (match, i) => (
            (users.filter(u => u.id === match).length > 0) ? <strong><Link key={match + i} to={`/u/${match}`} style={{ color: 'blue' }}>@{match}</Link></strong> : <span key={match + i}>@{match}</span>
        ))
    )
  

    // Find and replace hashtags in comment
    currentPostComments.map(c => 
        c.content = reactStringReplace(c.content, /#(\w+)/g, (match, i) => 
            <Link key={match + i} to={`/posts/#${match}`} style={{ color: 'red' }}><button type="button" onClick={() => {freshPostHandler()}} ><span>#{match}</span></button></Link>
        )
    )
  
 
    return(
        currentPostComments.map((comment, i) =>




            <div key={i} className="toast w-100" role="alert" aria-live="assertive" aria-atomic="true">
                 <div className="toast-header">
                 <div className="w-33">
                    <Link to={`/u/${comment.user}`} className="d-flex align-items-center">
                        {(users.filter(u => u.id === comment.user)).map((user, j) => 
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
                    <em>{comment.timestamp}</em>
                </div>
                <div className="w-33 d-flex justify-content-end">
                    {(checkOwned(comment)) ?
                        <button type="button" className="ml-2 mb-1 close" onClick={() => deleteComment(comment.id)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    : null
                    }  
                </div>   
                
                </div>   
                <div className="toast-body">
                    <p>
                        {comment.content}
                    </p>
                </div>
            </div>
        )
    )
}

export default Comments