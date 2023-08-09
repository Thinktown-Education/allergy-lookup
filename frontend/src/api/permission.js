import http from '../utils/http'

const permission = {
  getPermission() {
    return http.get(`/permission`)
  },
  updatePermission(requestBody) {
    return http.post(`/permission`, requestBody)
  }
}

export default permission
