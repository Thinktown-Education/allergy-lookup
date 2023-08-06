import http from '../utils/http'

const food = {
  findFood(param) {
    return http.get(`/findFood/${param}`)
  },

  findIngredients(param) {
    return http.get(`/findIngredients/${param}`)
  },

  findFoodByIngredients(requestBody) {
    return http.post(`/findFoodByIngredients`, requestBody)
  },
}

export default food
