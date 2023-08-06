import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import PropTypes from 'prop-types'
import api from 'src/api/api'

const DefaultLayout = ({ token }) => {
  api.auth.heartbeat().then((response) => {
    sessionStorage.setItem('email', response.data.data.email)
    sessionStorage.setItem('role', response.data.data.role)
  })

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

DefaultLayout.propTypes = {
  token: PropTypes.any,
}
