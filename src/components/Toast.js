import React from 'react'
import {Link} from 'react-router-dom'
import reactStringReplace from 'react-string-replace'


const Toast = ({post, i, currentUser, users, comments, freshPostHandler, likePost, deletePost, checkLike, checkOwned})   => {

    post.content = reactStringReplace(post.content, /#(\w+)/g, (match, i) => 
      <Link key={match + i} to={`/posts/#${match}`} style={{ color: 'red' }}><button type="button" onClick={() => {freshPostHandler()}} ><span>#{match}</span></button></Link>
      )
    
    // Find and replace @mentions in post content
   
    post.content = reactStringReplace(post.content, /@(\w+)/g, (match, i) => (
        (users.filter(u => u.id === match).length > 0) ? <strong><Link key={match + i} to={`/u/${match}`} style={{ color: 'blue' }}>@{match}</Link></strong> : <span key={match + i}>@{match}</span>
      ))
    



    const postComments = comments.filter(c => c.commentOn === post.id) 

    return(
        <div key={i} className="toast w-100" role="alert" aria-live="assertive" aria-atomic="true">
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
            <div className="toast-header toastFoot d-flex flex-wrap">
                <div className="d-flex align-items-center flex-row-reverse flex-sm-row w-33">
                    {(currentUser) ? 
                        <button type="button" className={(checkLike(post)) ? "btn btn-danger" : "btn btn-primary"} onClick={() => likePost(post)}>
                            <span aria-hidden="true">{(checkLike(post)) ? "Dislike" : "Like"}</span>
                        </button>
                    :
                        <button type="button" className="btn btn-secondary disabled">
                            <span aria-hidden="true">Like</span>
                        </button>
                    }
                    <strong className="mr-2 mr-sm-0 ml-0 ml-sm-2 ">Likes: {post.likes.length}</strong>
                </div>
                <div className="w-33 text-center">
                    <em>{post.timestamp}</em>
                </div>
                <div className="d-flex justify-content-end align-items-center w-33">
                    <strong className="mr-2">Replies: {postComments.length}</strong>
                    <Link key={post} to={`/posts/post/${post.id}`}><button type="button" className="btn btn-primary"><span>Reply</span></button></Link>    
                </div>
            </div>
        </div> 
    )
}

export default Toast
