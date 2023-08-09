import http from '../utils/http'

const permission = {
  getPermission() {
    return http.get(`/permission`)
  },
  updatePermission(requestBody) {
    return http.post(`/permission`, requestBody)
  },
  findUserByEmail(requestBody) {
    return http.get(`/permission/findUserByEmail`, requestBody)
  }
}

export default permission
