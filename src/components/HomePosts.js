import React, { useEffect, useState } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from '../components/Pagination' 
import Toast from '../components/Toast' 


const HomePosts = ({currentUser, users, posts, comments, updateCommentHandler, updatePostHandler, freshPostHandler,  likePost, deletePost, checkLike, checkOwned})   => {
    
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(15)
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


    let homePosts
    
    if((currentUser) && (users.filter(u => u.id === currentUser.id)[0])){
        homePosts = filteredPosts.filter(p => users.filter(u => u.id === currentUser.id)[0].follows.includes(p.user) || users.filter(u => u.id === currentUser.id)[0].subscriptions.includes(p.board)) 
    }

    //Pagination related code taken from https://www.youtube.com/watch?v=IYCa1F-OWmk
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    let currentPosts = []

    if(currentUser){
        currentPosts = homePosts.slice(indexOfFirstPost, indexOfLastPost)
    }else{
        currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost) 
    }

    let paginate = (pageNumber) => setCurrentPage(pageNumber)    

    return(
        <div className="w-100">
            
            { (currentUser) ? 
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="mb-0"></h2>
                
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
            : 
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="mb-0">Recent Posts</h2>
                
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
            }
            { (currentUser) && (users.filter(u => u.id === currentUser.id)[0]) ? 
                users.filter(u => u.id === currentUser.id)[0].follows.length === 1 && (!currentPosts.filter(p => p.user === currentUser.id)[0]) ? 
                currentPosts.map((post, i) =>                   
                <Toast post={post} i={i} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned}/> 
            )
                : 
                    currentPosts.map((post, i) =>                   
                        <Toast post={post} i={i} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned}/> 
                    ) 
            : 
                currentPosts.map((post, i) =>                     
                    <Toast post={post} i={i} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} likePost={likePost} deletePost={deletePost} checkLike={checkLike} checkOwned={checkOwned}/>    
                )   
                 
            }
            { (currentUser) ? 
                <Pagination postsPerPage={postsPerPage} totalPosts={homePosts.length} paginate={paginate} /> 
            : 
                <Pagination postsPerPage={postsPerPage} totalPosts={filteredPosts.length} currentPage={currentPage} paginate={paginate} />
            }
        </div>
    )  
}
export default HomePosts