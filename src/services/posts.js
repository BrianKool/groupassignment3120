import axios from 'axios'
const baseURL = '/api/'


/**
 * Get a list of all posts from the api
 * @return {Promise}    Promise that will resolve to the response data
 */
const getAll = () => {
  return axios.get(baseURL + "posts")
    .then(response => response.data)
    .catch((error) => {
      console.log('getAll error services/posts.js: ', error.message)
  })
}


/**
 * 
 * @param {Object} newObject a new post object
 * @returns {Promise} Promise that will resolve to the response data
 */
const create = (newObject, currentUser) => {
  if (!currentUser) {
      return new Promise(() => null)
  }

  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }

  return axios.post(baseURL + "posts", newObject, config)
    .then(response => response.data)
}

/**
 * Update an existing post via the API
 * @param {Object} post An modified post {code, title, offering}
 * @returns {Promise} Promise that will resolve to the response data
 */
const update = (post, currentUser) => {
  console.log("the post is: ", post);
  if (!currentUser) {
      return new Promise(() => null)
  }
  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }
  console.log("the post is: ", post)
  return axios.put(baseURL + "posts/" + post.id, post, config)
    .then(response => response.data)
}

/**
 * Delete an existing post via the API
 * @param {integer} postid the post id to delete
 * @returns {Promise} Promise that will resolve to the response data
 */
const remove = (postid, currentUser) => {
    
  if (!currentUser) {
      return new Promise(() => null)
  }

  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }

  return axios.delete(baseURL + "posts/" + postid, config)
    .then(response => response.data)
}

export default { getAll, create, update, remove }