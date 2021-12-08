import React, { useEffect, useState } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from '../components/Pagination' 
import Toast from '../components/Toast' 


const FilterPosts = ({currentUser, users, posts, comments, updateCommentHandler, updatePostHandler, freshPostHandler, likePost, deletePost, checkLike, checkOwned})   => {
    
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(10)
    const [filter, setFilter] = useState('Recent')

    useEffect(() => {
       updatePostHandler(posts)
    }, [])

    const handleSelect=(e)=>{
        setFilter(e)
    }

    let filteredPosts
      
    if(filter === "Recent"){
        filteredPosts = posts
    }
    else if(filter === "Likes"){
        filteredPosts = [].concat(posts)
        .sort((a,b) => (a.likes.length) < (b.likes.length) ? 1 : -1)
    }
    else if(filter === "Replies"){
        filteredPosts = [].concat(posts)
        .sort((a,b) => (comments.filter(c => c.commentOn === a.id).length) < (comments.filter(c => c.commentOn === b.id).length) ? 1 : -1)
    }


    //Pagination related code taken from https://www.youtube.com/watch?v=IYCa1F-OWmk
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

    let paginate = (pageNumber) => setCurrentPage(pageNumber)    




    return(
        <div className="w-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="mb-0">All Posts</h2>
            
                <div className="d-flex align-items-center">
                    <h4>Filter by: </h4>
                    <DropdownButton
                        alignRight
                        title={filter}
                        id="filterMenu"
                        onSelect={handleSelect}
                        className="ml-2" 
                    >
                        <Dropdown.Item eventKey="Recent">Recent</Dropdown.Item>
                        <Dropdown.Item eventKey="Likes">Likes</Dropdown.Item>
                        <Dropdown.Item eventKey="Replies">Replies</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            
            {
                currentPosts.map((post, i) =>   
                    <Toast post={post} i={i} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned} />      
                )
            }
            <Pagination postsPerPage={postsPerPage} totalPosts={filteredPosts.length} currentPage={currentPage} paginate={paginate} />
        </div>
    )  
}
export default FilterPosts