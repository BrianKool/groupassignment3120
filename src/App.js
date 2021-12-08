import React, {useState, useEffect} from 'react';

import {
  BrowserRouter as Router,
  Switch, Route, Link, Redirect
} from "react-router-dom"

import './App.css';
import postService from './services/posts'
import commentService from './services/comments'
import userService from './services/users'
import boardService from './services/boards'
import Register from './components/Register'
import Login from './components/Login'
import LoginForm from './components/LoginForm'
import Home from './components/Home.js'
import Tags from './components/Tags.js'
import Posts from './components/Posts.js'
import Post from './components/Post.js'
import User from './components/User.js'
import Users from './components/Users.js'
import Board from './components/Board.js'
import reactStringReplace from 'react-string-replace';

const images = require.context('../public/images', true)

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [boards, setBoards] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])

  //load all existing posts&Users from the server
  useEffect(() => {
      freshPostHandler()
    }, [])

  //handle updates to posts list
    async function freshPostHandler(){
      await userService
      .getAll()
      .then (initialUsers => {
        setUsers(initialUsers)
      })
      .catch(error => {
        alert(
          console.log("UserService promise error", error)
        )
      })

      await boardService
      .getAll()
      .then(initialBoards => {
        setBoards(initialBoards)
      })
      .catch(error => {
        alert(
          console.log("BoardService promise error:", error)
        )
      })

      await commentService
      .getAll()
      .then(initialComments => {
        setComments(initialComments)     
      })
      .catch(error => {
        alert(
          console.log("CommentService promise error:", error)
        )
      })   

      await postService
      .getAll()
      .then(initialPosts => {
        // store hashtags in tag array
        initialPosts.map(p => 
          p.tags = p.content.split(" ").filter(t => t.includes("#"))
        ) 
        setPosts(initialPosts) 
      })
      .catch(error => {
        alert(
          console.log("PostService promise error:", error)
        )
      }) 
    }
  
  //handle user login
  const userLoginHandler = (newCurrentUser) => {
    setCurrentUser(newCurrentUser)
  }

  //handle updates to users list
  const updateUserHandler = (req) => {
    userService.getAll()
    .then (updated => {
      setUsers(req)
    })
  }
  
  //handle updates to boards list
  const updateBoardHandler = (req) => {
    boardService.getAll()
    .then (updated => {
      setBoards(req)
    })
  } 

  //handle updates to posts list
  const updatePostHandler = (req) => {
    postService.getAll()
    .then (updated => {
      setPosts(req)
    })
  } 

  //handle updates to comments list
  const updateCommentHandler = (req) => {
    commentService.getAll()
    .then (updated => {
      setComments(req)
    })
  } 

  return (
    <Router>
      <div id="siteWrapper" className="d-flex flex-column">
        <div className="topHeader-wrapper w-100">
          <div id="topHeader">
            <div className="container">
              <div className="row">
                <div className="col-12 d-flex  flex-column justify-content-between align-items-center"> 
                  <nav className="navbar navbar-expand-lg p-0 d-flex justify-content-between w-100">
                    <div className="topBar d-flex">
                      <Link to={`/`}><img className="" src={images(`./psstlogo.png`)} alt="Psst Logo" /></Link> 
                      <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                          <li className="nav-item">
                            <Link className="nav-link" to="/posts/!#">Posts</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/u">Users</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/tags">Tags</Link>
                          </li>
                        </ul>
                      </div> 
                    </div>
                    <div className="loginContainer">
                      <LoginForm currentUser={currentUser} userLoginHandler={userLoginHandler}/>
                    </div>
                  </nav>
                  <nav className="d-lg-none p-0 d-flex justify-content-between w-100">
                      <div id="mobileNav">
                        <ul>
                          <li className="nav-item">
                            <Link className="nav-link" to="/posts/!#">Posts</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/users">Users</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/tags">Tags</Link>
                          </li>
                        </ul>
                      </div> 
                  </nav>
                </div>
              </div>
            </div>      
          </div>
        </div>
        <main className="py-5 my-5" role="main">
          <div className="container d-flex justify-content-center pt-5 pt-sm-3 pt-lg-0 mt-4 mt-lg-0">
            <Switch>
              <Route path="/register">
                {!currentUser ? <Register currentUser={currentUser} users={users} updateUserHandler={updateUserHandler} userLoginHandler={userLoginHandler} /> : <Redirect to={"/"}/>}
              </Route>
              <Route path="/login">
                {!currentUser ? <Login currentUser={currentUser} userLoginHandler={userLoginHandler} /> : <Redirect to="/"/>}
              </Route>
              <Route path="/u/:id">
                <User currentUser={currentUser} posts={posts} users={users}  comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} updatePostHandler={updatePostHandler} updateUserHandler={updateUserHandler}/>
              </Route>
              <Route path="/u">
                <Users currentUser={currentUser} posts={posts} users={users} usersToDisplay={users} updateUserHandler={updateUserHandler} />
              </Route>
              <Route path="/tags">
                <Tags posts={posts} freshPostHandler={freshPostHandler}/>
              </Route>
              <Route path="/posts/post/:id">
                <Post posts={posts} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} />
              </Route>
              <Route path="/posts">
                <Posts currentUser={currentUser} users={users} posts={posts} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler}/>
              </Route>
              <Route path="/b/:id">
                <Board boards={boards} posts={posts} currentUser={currentUser} users={users} comments={comments} updateCommentHandler={updateCommentHandler} freshPostHandler={freshPostHandler} updatePostHandler={updatePostHandler} updateBoardHandler={updateBoardHandler}/>
              </Route>
              <Route path="/">
                <Home currentUser={currentUser} users={users} posts={posts} boards={boards} comments={comments} updateCommentHandler={updateCommentHandler} updatePostHandler={updatePostHandler} freshPostHandler={freshPostHandler} updateUserHandler={updateUserHandler} />
              </Route>
            </Switch>
          </div>
        </main>
        <footer role="contentinfo" className="w-100">
          <div className="footer-below">
              <div className="container">
                <i>Psst app, Department of Computer Science 2020, 43436005</i>
              </div>
          </div>
        </footer> 
      </div>  
    </Router>
  );
}

export default App;