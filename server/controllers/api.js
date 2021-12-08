const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");
const Board = require("../models/boards");

const SECRET = process.env.SECRET;

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const apiRouter = express.Router();

//////////////////////////////////////////////////////////////////
//////////////////   POST RELATED ROUTES    //////////////////////
//////////////////////////////////////////////////////////////////
//handle GET request for /api/posts/:tag ~~ returns plain JSON

//handle GET request for /api/posts ~~ returns plain JSON
apiRouter.get("/api/posts", (request, response) => {
  Post.find({})
    .sort({ timestamp: -1 })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.log("error getting posts: ", error.message);
    });
});

apiRouter.get("/api/posts/:tags", (request, response) => {
  Post.find({})
    .sort({ timestamp: -1 })
    .then((result) => {
      console.log(result);
      response.json(result);
    });
});

//handle GET request for /api/units/:id ~~ returns plain JSON
apiRouter.get("/api/posts/post/:id", (request, response) => {
  Post.findById(request.params.id)
      .then((result) => {
    response.json(result);
  });
});

//handle POST request for creating a post
apiRouter.post("/api/posts", (request, response) => {
  const date = new Date().getDate(); //current Date
  const month = new Date().getMonth() + 1; //Current Month
  const year = new Date().getFullYear(); //Current Year
  const hours = new Date().getHours(); //Current Hours
  const min = new Date().getMinutes(); //Current Minutes
  const sec = new Date().getSeconds(); //Current Seconds
  const dateTime =
    year + "-" + month + "-" + date + " " + hours + ":" + min + ":" + sec; //concat date/time fields

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, SECRET);

  console.log("the token is: ", token)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newPost = new Post({
    id: body.id,
    user: decodedToken.id,
    timestamp: dateTime,
    content: body.content,
    board: body.board,
  });

  console.log("the newPost is: ", newPost);

  newPost.save().then((result) => {
    console.log("post record saved");
    response.json(result);
  });
});

//handle PUT request for updating a post
apiRouter.put("/api/posts/:id", (request, response, next) => {
  const body = request.body;

  const post = {
    likes: body.likes,
  };

  console.log("the post: ", post)
  
  Post.findByIdAndUpdate(request.params.id, post, { new: true })
    .then((updatedPost) => {
      console.log("the updatePost is: ", updatedPost)
      response.json(updatedPost);
    })
    .catch((error) => next(error));
});

//handle DELETE request for deleting a post
apiRouter.delete("/api/posts/:id", (request, response, next) => {
  Post.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log("the result is: ", result)
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//////////////////////////////////////////////////////////////////
////////////////   COMMENT RELATED ROUTES    /////////////////////
//////////////////////////////////////////////////////////////////

apiRouter.get("/api/comments", (request, response) => {
  Comment.find({})
    .sort({ timestamp: -1 })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.log("error getting comments: ", error.message);
    });
});

//handle POST request for creating a post
apiRouter.post("/api/comments", (request, response) => {
  const date = new Date().getDate(); //current Date
  const month = new Date().getMonth() + 1; //Current Month
  const year = new Date().getFullYear(); //Current Year
  const hours = new Date().getHours(); //Current Hours
  const min = new Date().getMinutes(); //Current Minutes
  const sec = new Date().getSeconds(); //Current Seconds
  const dateTime =
    year + "-" + month + "-" + date + " " + hours + ":" + min + ":" + sec; //concat date/time fields

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newComment = new Comment({
    user: decodedToken.id,
    timestamp: dateTime,
    content: body.content,
    commentOn: body.post,
  });

  newComment.save().then((result) => {
    console.log("comment record saved");
    response.json(result);
  });
});

//handle DELETE request for deleting a post
apiRouter.delete("/api/comments/:id", (request, response, next) => {
  Comment.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//////////////////////////////////////////////////////////////////
//////////////////   USER RELATED ROUTES    //////////////////////
//////////////////////////////////////////////////////////////////

//handle GET request for /api/user ~~ returns plain JSON
apiRouter.get("/api/users/", (request, response) => {
  User.find().then((result) => {
    response.json(result);
  });
});

//handle POST request for /api/register
apiRouter.post("/api/register", (request, response) => {
  const body = request.body;
  console.log("the body is:　", body)

  if (!(body.username && body.password)) {
    return response.status(400).json({
      error: "username or password missing",
    });
  }

  const pwcrypt = bcrypt.hash(body.password, 10).then((result) => {
    const newUser = new User({
      id: body.username,
      follows: body.username,
      password: result,
      avatar: "https://robohash.org/" + body.username,
      bio: body.username + " is a new user!",
      displayName: body.displayName,
      gender: body.gender,
      subscriptions: body.subscriptions,
    });
    newUser.save().then((result) => {
      console.log("user record saved");
      response.json(result);
    });
  });
});

//handle PUT requests for updating users
apiRouter.put("/api/users/:id", (request, response, next) => {
  const body = request.body;

  const user = {
    follows: body.follows,
    bio: body.bio,
    subscriptions: body.subscriptions,
    displayName: body.displayName,
    gender: body.gender,
  };

  User.findOneAndUpdate({ id: request.params.id }, user, { new: true })
    .then((updatedUser) => {
      console.log("the updateUser is: ", updatedUser)
      response.json(updatedUser);
    })
    .catch((error) => next(error));
});

//////////////////////////////////////////////////////////////////
//////////////////   BOARD RELATED ROUTES    /////////////////////
//////////////////////////////////////////////////////////////////

//handle GET request for /api/boards ~~ returns plain JSON
apiRouter.get("/api/boards/", (request, response) => {
  Board.find().then((result) => {
    response.json(result);
  });
});

apiRouter.post("/api/boards", (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newBoard = new Board({
    id: body.id,
    desc: body.desc,
  });

  newBoard.save().then((result) => {
    console.log("board record saved");
    response.json(result);
  });
});

//handle PUT requests for updating boards
apiRouter.put("/api/boards/:id", (request, response, next) => {
  const body = request.body;

  const board = {
    id: body.desc,
    desc: body.desc,
  };

  Board.findOneAndUpdate({ id: request.params.id }, board, { new: true })
    .then((updatedBoard) => {
      response.json(updatedBoard);
    })
    .catch((error) => next(error));
});

//////////////////////////////////////////////////////////////////
//////////////////   LOGIN RELATED ROUTES    /////////////////////
//////////////////////////////////////////////////////////////////

//handle post request for logging in with {username, password}
apiRouter.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ id: username }).exec();

  ///////This line to temporary fix about the username incorrect///
  if (!user) {
    return res.status(401).json({error: "invalid username or password"})
}

  if (await bcrypt.compare(password, user.password)) {
    const userForToken = {
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET);

    return res.status(200).json({ token, id: user.id });
  } else {
    return res.status(401).json({ error: "invalid username or password" });
  }
});

module.exports = apiRouter;
