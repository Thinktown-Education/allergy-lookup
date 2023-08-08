import http from '../utils/http'

const permission = {
  getPermission(requestBody) {
    return http.get(`/permission`, { params: requestBody })
  },
}

export default permission
