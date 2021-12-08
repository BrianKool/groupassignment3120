import React from 'react'
import {Link} from 'react-router-dom'

const LoginForm = ({currentUser, userLoginHandler}) => {

    const logout = (event) => {
        event.preventDefault()
        userLoginHandler(null)
    }
  
    if(currentUser) {
        return (
            <div className="float-right d-flex align-items-center">
                <div className="d-flex flex-wrap"><span className="mr-1">Logged in as</span><Link className="profileLink mr-1" to={`/u/${currentUser.id}`}><strong>{currentUser.id}</strong></Link> | </div> <button type="submit" id="submit" onClick={logout} className="btn btn-primary ml-2">Logout</button>
            </div>
        )
    } else{
        return (
            <div className="float-right d-flex align-items-center">
                <Link className="loginLink mr-2" to='/login'>login</Link>
                <span>|</span>
                <Link className="loginLink btn btn-primary ml-2" to='/register'>Register</Link>
            </div>  
        )
    }
}
export default LoginForm