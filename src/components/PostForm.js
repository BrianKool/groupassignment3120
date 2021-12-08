import React, {useState} from 'react'
import {Link} from "react-router-dom"
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import postService from '../services/posts'  
import reactStringReplace from 'react-string-replace';

const PostForm = ({users, posts, boards, currentUser, displayBoard, updatePostHandler, freshPostHandler}) => {

    const [newPostContent, setNewPostContent] = useState ('')
    const [postBoard, setpostBoard] = useState('')

    const handleSelect=(e)=>{
        setpostBoard(e)
    }


    const addPost = (event) => {
        event.preventDefault()


        let postObject

        if(postBoard == "None"){
            postObject = {
                id:posts.length+1,
                content:newPostContent,
                tags:[],   
                board:null
            }
        }
        else{
            postObject = {
                id:posts.length+1,
                content:newPostContent,  
                tags:[], 
                board:postBoard
            }
        }

        postService.create(postObject, currentUser)
        .then(returnedPost => {

            let regexPost = returnedPost
            regexPost.tags = regexPost.content.split(" ").filter(t => t.includes("#"))

            let regexText = reactStringReplace(regexPost.content, /#(\w+)/g, (match, i) => (
                <Link key={match + i} to={`/posts/#${match}`} style={{ color: 'red' }}><button type="button" onClick={() => {freshPostHandler(users)}} ><span>#{match}</span></button></Link>
            ))
            regexText = reactStringReplace(regexText, /@(\w+)/g, (match, i) => (
                (users.filter(u => u.id === match).length > 0) ? <strong><Link key={match + i} to={`/users/${match}`} style={{ color: 'blue' }}>@{match}</Link></strong> : <span key={match + i}>@{match}</span>
            ))

            regexPost.content = regexText

            const updatedPosts = posts.reverse().concat(regexPost).reverse()
            updatePostHandler(updatedPosts)
            
            setNewPostContent('')
        })
        .catch(error => {
            alert(
                `Content field cannot be empty`
            )
        })

    }

    if(currentUser) {
        return (
            <div className="postFormContainer w-100">
                {(displayBoard) ?
                    <h4>Add a new post to b/{displayBoard.id}</h4>
                :
                    <h4>Add a new post</h4>
                }
                <p>Let people know what you are thinking</p>
                <form onSubmit={addPost}>
                    <div className="input-group flex-column align-items-start">
                        <textarea type="text" className="form-control postContent w-100 mr-0 mb-2" placeholder="Content..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
                        <div className="d-flex justify-content-end w-100" >
                            {(displayBoard) ?
                                <div></div>
                            :
                                <DropdownButton
                                    alignRight
                                    title={postBoard}
                                    placeholder="Post to"
                                    id="filterMenu"
                                    onSelect={handleSelect}
                                    className="mr-2" 
                                >
                                    {boards.map((b, i) => 
                                        <Dropdown.Item key={i} eventKey={`${b.id}`}>{b.id}</Dropdown.Item>  
                                    )}
                                </DropdownButton>
                            }
                            <button type="submit" className="btn btn-primary">Post</button>
                        </div>
                    </div>
                </form> 
            </div> 
        )
    }
    else {
        return (null)
    }
}

export default PostForm