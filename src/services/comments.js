import axios from 'axios'
const baseURL = '/api/'


/**
 * Get a list of all comments from the api
 * @return {Promise}    Promise that will resolve to the response data
 */
const getAll = () => {
  return axios.get(baseURL + "comments")
    .then(response => response.data)
    .catch((error) => {
      console.log('getAll error services/comments.js: ', error.message)
  })
}

/**
 * 
 * @param {Object} newObject a new comment object
 * @returns {Promise} Promise that will resolve to the response data
 */
const create = (newObject, currentUser) => {
console.log(currentUser)
  if (!currentUser) {
      return new Promise(() => null)
  }

  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }
  console.log(config)
  return axios.post(baseURL + "comments", newObject, config)
    .then(response => response.data)
}

/**
 * Delete an existing comment via the API
 * @param {integer} postid the comment id to delete
 * @returns {Promise} Promise that will resolve to the response data
 */
const remove = (commentid, currentUser) => {
    
    if (!currentUser) {
        return new Promise(() => null)
    }
  
    const config = {headers: {Authorization: "Bearer " + currentUser.token}  }
  
    return axios.delete(baseURL + "comments/" + commentid, config)
      .then(response => response.data)
  }
  

export default { getAll, create, remove }