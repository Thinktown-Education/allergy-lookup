import http from '../utils/http'

const food = {
  findFood(requestBody) {
    return http.get(`/findFood`, {params: requestBody})
  },

  findIngredients(requestBody) {
    return http.get(`/findIngredients`, {params: requestBody})
  },

  findFoodByIngredients(requestBody) {
    return http.post(`/findFoodByIngredients`, requestBody)
  },

  addFood(requestBody) {
    return http.post(`/addFood`, requestBody)
  },

  editFood(requestBody) {
    return http.post(`/editFood`, requestBody)
  },

  deleteFood(id) {
    return http.get(`/deleteFood/${id}`)
  }
}

export default food
