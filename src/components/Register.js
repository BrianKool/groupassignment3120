import React, { useEffect, useState } from 'react'
import userService from '../services/users.js'
import loginService from '../services/login.js'

import {Link} from 'react-router-dom'

const Register = ({currentUser, users, userLoginHandler, updateUserHandler}) => {

    useEffect(() => {
        updateUserHandler(users)
     }, [])


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const registerHandler = (event) => {
        event.preventDefault()
    
        if(users.filter(u => u.id === username).length > 0){
            alert("Username already taken")
        }
        else{
            if(password !== passwordConfirm){
                alert("Passwords do not match")
            }
            else{
                const userObject = {
                    username:username,
                    password:password,      
                }
                userService.register(userObject)
                .then(returnedUser => {

                    const updatedUsers = users.concat(returnedUser)
                    
                    updateUserHandler(updatedUsers)
                    loginService.login({username, password})
                    .then(data => {
                        console.log("Success: ", data)
                        userLoginHandler(data)
                    })
                    .catch(error => {
                        console.log("Error:", error)
                    })
                    
                    setUsername('')
                    setPassword('')
                    setPasswordConfirm('')
                })
                .catch(error => {
                    console.log("Error:", error)
                })
                
            }
        }
    }
   
    if(currentUser){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Already registered</h1>
                        <p>What are you doing here <Link className="profileLink" to={`/users/${currentUser.id}`}>{currentUser.id}</Link>? Go Home, you're drunk.</p>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Register</h1>
                    </div>
                    <div className="col-lg-6">
                        <form onSubmit={registerHandler}>
                            <div className="input-group flex-column">
                                <input type="text" id="registerUsername" name="registerUsername" className="form-control w-100 mb-2" placeholder="Username" aria-label="Username" required onChange={e => setUsername(e.target.value)} />
                                <input type="password" id="registerPassword" name="registerPassword" className="form-control w-100 mb-2" placeholder="Password" aria-label="Password" required onChange={e => setPassword(e.target.value)} />
                                <input type="password" id="registerpasswordConfirm" name="registerPasswordConfirm" className="form-control w-100 mb-2" placeholder="Confirm Password" aria-label="Password" required onChange={e => setPasswordConfirm(e.target.value)} />
                                <button type="submit" id="registerSubmit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
   

export default Register;