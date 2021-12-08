import React, { useEffect, useState } from 'react'
import Pagination from '../components/Pagination' 
import Toast from '../components/Toast' 


const TaggedPosts = ({currentUser, users, urlHash, posts, comments, updateCommentHandler, updatePostHandler, freshPostHandler,  likePost, deletePost, checkLike, checkOwned})   => {
    
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(10)

    useEffect(() => {
       updatePostHandler(posts)
    }, [])

    const filteredPosts = posts.filter(p => p.tags.includes(urlHash))

    //Pagination related code taken from https://www.youtube.com/watch?v=IYCa1F-OWmk
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

    let paginate = (pageNumber) => setCurrentPage(pageNumber)    

    return(
        <div className="w-100">
            <h2>Posts tagged with '{urlHash}'</h2>
            {
                currentPosts.map((post, i) =>                   
                    <Toast post={post} i={i} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned}/>       
                )
            }
            <Pagination postsPerPage={postsPerPage} totalPosts={filteredPosts.length} currentPage={currentPage} paginate={paginate} />
        </div>
    )  
}
export default TaggedPosts