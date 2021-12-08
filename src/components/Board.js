import React from 'react'
import {useParams} from 'react-router-dom'
import Posts from './Posts.js'
import PostForm from './PostForm.js'

const Board = ({boards, posts, currentUser, users, comments, updateCommentHandler, updatePostHandler, freshPostHandler, updateBoardHandler, updateUserHandler}) => {
    
    let boardID = useParams().id
    let displayBoard = boards.find(b => b.id === boardID)

    if(displayBoard){
        return (
            <div>
                <div class="row">
                    <div className="col-12"> 
                        <h2>{displayBoard.id}</h2>
                        <p>b/{displayBoard.id}</p>
                    </div>
                </div>
                <div class="row">


                {(currentUser) ?
                    <div className="col-lg-9"> 
                        <PostForm users={users} posts={posts} displayBoard={displayBoard} currentUser={currentUser}  freshPostHandler={freshPostHandler} updatePostHandler={updatePostHandler} />
                        <Posts currentUser={currentUser} users={users} displayBoard={displayBoard} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} filter=""/>
                    </div>
                :
                    <div className="col-lg-9">
                        <Posts currentUser={currentUser} users={users} displayBoard={displayBoard} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} filter=""/>
                    </div>
                }
                    <div className="d-none d-lg-inline-block col-lg-3"> 
                        <div className="toast w-100" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="toast-body">
                                <p>{displayBoard.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return null
}   

export default Board