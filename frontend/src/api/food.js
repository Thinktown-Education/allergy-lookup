import http from '../utils/http'

const food = {
  findFood(requestBody) {
    return http.get(`/findFood`, { params: requestBody })
  },

  findIngredients(requestBody) {
    return http.get(`/findIngredients`, { params: requestBody })
  },

  findFoodByIngredients(requestBody) {
    return http.post(`/findFoodByIngredients`, requestBody)
  },
}

export default food
