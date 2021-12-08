import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import Posts from './Posts.js'
import userService from '../services/users'  


const User = ({ posts, currentUser, users, comments, updateCommentHandler, updatePostHandler, updateUserHandler }) => {

    let userID = useParams().id

    let displayUser = users.find(u => u.id === userID)

    let displayUserName
    let displayUserGender
    let displayUserBio

    if(displayUser == null){
        displayUserName = ""
        displayUserGender = ""
        displayUserBio = ""
    }
    else{
        displayUserName = displayUser.displayName
        displayUserGender = displayUser.gender
        displayUserBio = displayUser.bio
    }

    const [displayName, setDisplayName] = useState(displayUserName)
    const [gender, setGender] = useState(displayUserGender)
    const [bio, setBio] = useState(displayUserBio)
    
    const [editMode, setEditMode] = useState(false)

    const updateFollows = (userForAction, followAction) => {
        let updatedFollows

        if(followAction === "follow"){
            updatedFollows = users.filter(u => u.id === currentUser.id)[0].follows.concat(userForAction)
        }
        else{
            updatedFollows = users.filter(u => u.id === currentUser.id)[0].follows.filter(f => f !== userForAction)
        }
            
        const userObject = {
            displayName: displayUser.displayName,
            gender: displayUser.gender,
            bio: displayUser.bio,
            subscriptions: displayUser.subscriptions,
            follows: updatedFollows
        }

        userService.update(userObject,currentUser).then(returnedUser => {
            const newUsers = users.map(
                user => user.id !== returnedUser.id ? user : returnedUser 
            )
            updateUserHandler(newUsers)
        })
    }

    const updateSubs = (boardForAction, subAction) => {
        let updatedSubs

        if(subAction === "sub"){
            updatedSubs = users.filter(u => u.id === currentUser.id)[0].subscriptions.concat(boardForAction)
        }
        else{
            updatedSubs = users.filter(u => u.id === currentUser.id)[0].subscriptions.filter(f => f !== boardForAction)
        }

        const userObject = {
            displayName: displayUser.displayName,
            gender: displayUser.gender,
            bio: displayUser.bio,
            follows:displayUser.follows,
            subscriptions: updatedSubs
        }
        
        userService.update(userObject,currentUser).then(returnedUser => {
            const newUsers = users.map(
                user => user.id !== returnedUser.id ? user : returnedUser 
            )
            updateUserHandler(newUsers)
        })

        
    }

    const updateUser = (event) => {

        event.preventDefault()

        const userObject = {
            displayName: displayName,
            gender: gender,
            bio: bio,
            subscriptions: displayUser.subscriptions,
            follows:displayUser.follows
        }

        console.log(userObject)

        userService.update(userObject, currentUser).then(returnedUser => {
            const newUsers = users.map(
                user => user.id !== returnedUser.id ? user : returnedUser 
            )
            updateUserHandler(newUsers)
        })
       
        setEditMode(false)

    }

 


    

    if(displayUser){
        return (
            <div className="container">
                <div className="row pb-4">
                    <div className="col-md-4">
                        <div>
                            <img src={displayUser.avatar} className="w-100" alt="avatar" />
                        </div>
                        {currentUser && (users.filter(u => u.id === currentUser.id)[0]) ? currentUser.id !== displayUser.id ? users.filter(u => u.id === currentUser.id)[0].follows.filter(f => f === displayUser.id).length > 0 ?
                            <button type="button" className="btn btn-danger w-100" onClick={() => updateFollows(displayUser, "unfollow")} aria-label="Like">
                                <span aria-hidden="true">Unfollow</span>
                            </button>  
                        : 
                            <button type="button" className="btn btn-primary w-100" onClick={() => updateFollows(displayUser, "follow")} aria-label="Like">
                                <span aria-hidden="true">Follow</span>
                            </button>
                        :
                            <div></div>
                        :
                            <button type="button" disabled className="btn btn-secondary w-100" aria-label="Like">
                                <span aria-hidden="true">Follow</span>
                            </button>
                        }                    
                    </div>
            
                    <div className="col-md-8">
                    
                        {currentUser && users.filter(u => u.id === currentUser.id)[0] && currentUser.id === displayUser.id && editMode ? 
                                <form onSubmit={updateUser}>
                                    <div className="input-group flex-column">
                                        <h4>Display Name</h4>
                                        <input type="text" className="form-control w-100 mr-0 mb-2" placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                                        <h4>Gender</h4>
                                        <input type="text" className="form-control w-100 mr-0 mb-2" placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} />
                                        <h4>About</h4>
                                        <textarea type="text" className="form-control postContent w-100 mr-0 mb-2" placeholder="About" value={bio} onChange={e => setBio(e.target.value)} />
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form> 
                            : 
                            <div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <h1 className="pr-2">{displayUser.displayName}</h1>
                                        <span>(u/{displayUser.id})</span>
                                    </div>
                                    {currentUser && users.filter(u => u.id === currentUser.id)[0] && currentUser.id === displayUser.id ?     
                                        <div><button type="submit" className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button></div>
                                    :null}
                                </div>
                                <div className="w-50 pr-5"> 
                                    <h4>Gender</h4>
                                    <p>{displayUser.gender}</p>
                                </div>
                                <div className="w-100"> 
                                    <h4>About</h4>
                                    <p>{displayUser.bio}</p>                               
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row pb-4">
                    <div className="col-lg-4">
                        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">     
                            <div className="toast-header justify-content-center text-center">
                                <h4>Subs</h4>
                            </div>
                            <div className="toast-body">
                                {displayUser.subscriptions.length > 0  ?
                                    <ul>
                                        {displayUser.subscriptions.filter(s => s !== displayUser.board).map(boardName => 
                                        <li key={boardName} className="d-flex justify-content-between align-items-center">
                                            <Link to={`/b/${boardName}`}>
                                                <strong className="mr-auto">{boardName}</strong>
                                            </Link>
                                            {currentUser && users.filter(u => u.id === currentUser.id)[0] && currentUser.id === displayUser.id ?
                                                <button type="button" className="ml-2 mb-1 close"onClick={() => updateSubs(boardName, "unsub")} aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            : null 
                                            }

                                        </li>
                                        )}
                                    </ul>
                                :
                                    <span>Not subscribed to any boards</span>
                                }
                            </div>
                        </div> 
                    </div>   
                    <div className="col-lg-4">
                        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">     
                            <div className="toast-header justify-content-center text-center">
                                <h4>Follows</h4>
                            </div>
                            <div className="toast-body">
                                {displayUser.follows.filter(f => f !== displayUser.id)[0] ?
                                    <ul>
                                        {displayUser.follows.filter(f => f !== displayUser.id).map(followName => 
                                        <li key={followName} className="d-flex justify-content-between align-items-center">
                                            <Link to={`/u/${followName}`}>
                                                <strong className="mr-auto">{followName}</strong>
                                            </Link>
                                            {currentUser && users.filter(u => u.id === currentUser.id)[0] && currentUser.id === displayUser.id ?
                                                <button type="button" className="ml-2 mb-1 close" onClick={() => updateFollows(followName, "unfollow")} aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            : null 
                                            }

                                        </li>
                                        )}
                                    </ul>
                                :
                                    <span>Not following any users</span>
                                }
                            </div>
                        </div>                  
                    </div>
                    <div className="col-lg-4">
                        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">     
                            <div className="toast-header justify-content-center text-center">
                            <h4>Followers</h4>
                            </div>
                            <div className="toast-body">
                                {(users.filter(u => u.follows.includes(displayUser.id)).filter(u => u.id !== displayUser.id)[0]) ?
                                    <ul>
                                    {users.filter(u => u.follows.includes(displayUser.id)).filter(u => u.id !== displayUser.id).map((user, i) =>
                                        <li key={user.id}><Link to={`/u/${user.id}`}>
                                                <strong className="mr-auto">{user.id}</strong>
                                            </Link>
                                        </li>
                                    )}
                                    </ul>
                                    : <span>Not followed by any users</span>
                                }
                            </div>
                        </div>                 
                    </div>
                </div>
                <br/>
                <Posts currentUser={currentUser} users={users} displayUser={displayUser} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} filter=""/>
        </div>
        )
        } else {
        return 'Not Found'
        }
    }

    export default User



