import http from '../utils/http'

const permission = {
  findUser(requestBody) {
    return http.get(`/findUser`, { params: requestBody })
  },
  updateUser(requestBody) {
    return http.post(`/updateUser`, requestBody)
  },
}

export default permission