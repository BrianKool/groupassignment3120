import React, { useState } from 'react'
import loginService from '../services/login.js'
import {Link} from 'react-router-dom'

const Login = ({currentUser, userLoginHandler}) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const formHandler = (event) => {
        event.preventDefault()
        console.log("Form submitted", username)

        loginService.login({username, password})
        .then(data => {
            console.log("Success: ", data)
            userLoginHandler(data)
        })
        .catch(error => {
            console.log("Error:", error)
        })
    }

    if(currentUser){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Already logged in</h1>
                        <p>What are you doing here <Link className="profileLink" to={`/users/${currentUser.id}`}>{currentUser.id}</Link>? Go <Link to='/home'>home</Link>, you're drunk.</p>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Login</h1>
                    </div>
                    <div className="col-lg-6">
                        <form onSubmit={formHandler}>
                            <div className="input-group flex-column">
                                <input type="text" id="loginUsername" name="loginUsername" className="form-control w-100 mb-2" placeholder="Username" aria-label="Username" required onChange={e => setUsername(e.target.value)} />
                                <input type="password" id="loginPassword" name="loginPassword" className="form-control w-100 mb-2" placeholder="Password" aria-label="Password" required onChange={e => setPassword(e.target.value)} />
                                <button type="submit" id="loginSubmit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
   

export default Login;