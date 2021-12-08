import axios from 'axios'
const baseURL = '/api/'


/**
 * Get a list of all boards from the api
 * @return {Promise} Promise that will resolve to the response data
 */
const getAll = () => {
  return axios.get(baseURL + "boards")
    .then(response => response.data)
    .catch((error) => {
      console.log('getAll error services/boards.js: ', error.message)
  })
}


/**
 * 
 * @param {Object} newObject a new board object
 * @returns {Promise} Promise that will resolve to the response data
 */
const create = (newObject, currentUser) => {
  if (!currentUser) {
      return new Promise(() => null)
  }

  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }

  return axios.board(baseURL + "boards", newObject, config)
    .then(response => response.data)
}

/**
 * Update an existing board via the API
 * @param {Object} board a modified board 
 * @returns {Promise} Promise that will resolve to the response data
 */
const update = (board, currentUser) => {
  if (!currentUser) {
      return new Promise(() => null)
  }
  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }
  return axios.put(baseURL + "boards/" + board.id, board, config)
    .then(response => response.data)
}

/**
 * Delete an existing board via the API
 * @param {integer} boardid the board id to delete
 * @returns {Promise} Promise that will resolve to the response data
 */
const remove = (boardid, currentUser) => {
    
  if (!currentUser) {
      return new Promise(() => null)
  }

  const config = {headers: {Authorization: "Bearer " + currentUser.token}  }

  return axios.delete(baseURL + "boards/" + boardid, config)
    .then(response => response.data)
}

export default { getAll, create, update, remove }