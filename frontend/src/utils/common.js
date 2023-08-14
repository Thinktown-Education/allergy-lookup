var common = {
  // env
  env: process.env.NODE_ENV,
  // base url
  base_url: 'http://localhost:5000',
  /**
   * Common method for checking empty objeect
   * @param {*} value
   * @returns
   */
  isEmpty: function (value) {
    return (
      value === '' || value == null || value === undefined || value === [] || value.length === 0
    )
  },

  getRole: function () {
    return sessionStorage.getItem('role')
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
