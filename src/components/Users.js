import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import userService from '../services/users'  


const Users = ({ currentUser, users, usersToDisplay, updateUserHandler, filter }) => {
    
    useEffect(() => {
        updateUserHandler(users)
    }, [])

    console.log(users)

    const updateFollows = (userForAction, followAction) => {
        let updatedFollows

        if(followAction === "follow"){
            updatedFollows = users.filter(u => u.id === currentUser.id)[0].follows.concat(userForAction.id)
        }
        else{
            updatedFollows = users.filter(u => u.id === currentUser.id)[0].follows.filter(f => f !== userForAction.id)
        }
        
        const user = users.filter(u => u.id === currentUser.id)[0]

        const userObject = {
            displayName: user.displayName,
            gender: user.gender,
            bio: user.bio,
            subscriptions: user.subscriptions,
            follows: updatedFollows
        }


        userService.update(userObject,currentUser).then(returnedUser => {
            const newUsers = users.map(
                user => user.id !== returnedUser.id ? user : returnedUser 
            )
            updateUserHandler(newUsers)
        })
    }
    
    const sortedUsers = [].concat(usersToDisplay)
    .sort((a,b) => (users.filter(u => u.follows.includes(a.id)).length) < (users.filter(u => u.follows.includes(b.id)).length) ? 1 : -1 )

    return(
        <div className="row">
            <div className="col-12">
                {filter === "Home" ? 
                    <div>
                        <h2>Top 10 Users</h2>      
                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start homeUsers">
                            {sortedUsers.map((user, i) => 
                                
                                <div key={i} className="toast user" role="alert" aria-live="assertive" aria-atomic="true">
                                    <Link to={`/u/${user.id}`}>
                                        <div className="toast-header justify-content-center text-center flex-column">
                                            <h5 className="mb-0">{user.displayName}</h5>
                                            <span>u/{user.id}</span>
                                        </div>
                                        <div className="toast-body">
                                            <img src={user.avatar} alt="avatar" />
                                        </div>
                                    </Link>
                                    <div className="toast-header justify-content-center">
                                        {(currentUser) && (users.filter(u => u.id === currentUser.id)[0]) ? currentUser.id !== user.id ? users.filter(u => u.id === currentUser.id)[0].follows.filter(f => f === user.id).length > 0 ?
                                            <button type="button" className="btn btn-danger" onClick={() => updateFollows(user, "unfollow")}>
                                                <span aria-hidden="true">Unfollow</span>
                                            </button>  
                                        : 
                                            <button type="button" className="btn btn-primary" onClick={() => updateFollows(user, "follow")}>
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        :
                                            <button type="button" disabled className="btn btn-secondary">
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        :
                                            <button type="button" disabled className="btn btn-secondary">
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        }   
                                    </div>
                                </div>  
                            )}
                        </div> 
                    </div>
                    : 
                    <div>
                        <h2>All Users</h2>
                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
                            {sortedUsers.map((user, i) => 
                                
                                <div key={i} className="toast user" role="alert" aria-live="assertive" aria-atomic="true">
                                    <Link to={`/u/${user.id}`}>
                                        <div className="toast-header justify-content-center text-center flex-column">
                                            <h5 className="mb-0">{user.displayName}</h5>
                                            <span>u/{user.id}</span>
                                        </div>
                                        <div className="toast-body">
                                            <img src={user.avatar} alt="avatar" />
                                        </div>
                                    </Link>
                                    <div className="toast-header justify-content-center">
                                        {(currentUser) && (users.filter(u => u.id === currentUser.id)[0]) ? currentUser.id !== user.id ? users.filter(u => u.id === currentUser.id)[0].follows.filter(f => f === user.id).length > 0 ?
                                            <button type="button" className="btn btn-danger" onClick={() => updateFollows(user, "unfollow")}>
                                                <span aria-hidden="true">Unfollow</span>
                                            </button>  
                                        : 
                                            <button type="button" className="btn btn-primary" onClick={() => updateFollows(user, "follow")}>
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        :
                                            <button type="button" disabled className="btn btn-secondary">
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        :
                                            <button type="button" disabled className="btn btn-secondary">
                                                <span aria-hidden="true">Follow</span>
                                            </button>
                                        }   
                                    </div>
                                </div>  
                            )}
                        </div> 
                    </div>
                }
            </div> 
        </div> 
    )
}    

export default Users