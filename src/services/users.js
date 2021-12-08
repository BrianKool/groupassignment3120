import axios from 'axios'
const baseURL = '/api/'


/**
 * Get a list of all users from the api
 * @return {Promise}    Promise that will resolve to the response data
 */

const getAll = () => {
  return axios.get(baseURL + "users")
    .then(response => response.data)
    .catch((error) => {
      console.log('getAll error services/users.js: ', error.message)
  })
}



/**
 * create new user via the API
 * @param {Object} user A User 
 * @returns {Promise} Promise that will resolve to the response data
 */
const register = (newObject) => {
  return axios.post(baseURL + "register", newObject)
  .then(response => response.data)
}
  

/**
 * Update an existing user via the API
 * @param {Object} post A modified user 
 * @returns {Promise} Promise that will resolve to the response data
 */
const update = (userToUpdate, currentUser) => {
  if (!currentUser) {
      return new Promise(() => null)
  }
  console.log("userToUpdate is: ", userToUpdate)
  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }
  return axios.put(baseURL + "users/" + currentUser.id, userToUpdate, config)
    .then(response => response.data)
}

export default { getAll, register, update }