var common = {
  // base url
  base_url: process.env.NODE_ENV == "production" ? process.env.REACT_APP_BASE_URL + "/api" : "http://localhost:5000/api",
  /**
   * Common method for checking empty objeect
   * @param {*} value
   * @returns
   */
  isEmpty: function (value) {
    return (
      value === '' || value == null || value === undefined || value == [] || value.length === 0
    )
  },

  getRole: function () {
    return localStorage.getItem('role')
  },

  getRoleName: function (value) {
    var roles = {
      0: 'User',
      1: 'Editor',
      2: 'Admin',
    }
    return roles[value]
  },
}
export default common
