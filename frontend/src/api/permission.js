import http from '../utils/http'

const permission = {
  // getPermission() {
  //   return http.get(`/permission`)
  // },
  findUser(requestBody) {
    return http.get(`/permission`, { params: requestBody })
  },
  updatePermission(requestBody) {
    return http.post(`/permission`, requestBody)
  },
}

export default permission
