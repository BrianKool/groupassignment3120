import React, { useEffect, useState } from 'react'
import Posts from '../components/Posts.js'
import PostForm from '../components/PostForm.js'
import Users from '../components/Users.js'

const Home = ({currentUser, users, posts, boards, comments, updateCommentHandler, updatePostHandler, updateUserHandler, freshPostHandler }) => {

    const [currentPage] = useState(1)
    const [usersPerPage] = useState(10)

    useEffect(() => {
        updateUserHandler(users)
    }, [])

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)



    return(
       
        <div className="row">
            
           
                <div className="col-lg-9"> 
                    {(currentUser) ?
                        <div>
                            <h2>Your Feed</h2>
                            <PostForm users={users} posts={posts} boards={boards} currentUser={currentUser}  freshPostHandler={freshPostHandler} updatePostHandler={updatePostHandler} />
                        </div>
                    : null
                    }
                    <Posts currentUser={currentUser} users={users} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} filter="Home" />
                </div>
            
           
            
            <div className="d-none d-lg-inline-block col-lg-3">
                <div>
                    <Users currentUser={currentUser} users={users} usersToDisplay={currentUsers} updateUserHandler={updateUserHandler} filter="Home"/>
                </div>
            </div>
        </div>
      
    )
}


export default Home;