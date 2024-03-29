import { React, useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from 'src/api/api'
import menu from '../menu'
import nav from '../_nav'

const DefaultLayout = ({ token }) => {
  const [navigation, setNavigation] = useState([])
  const [role, setRole] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    api.auth.heartbeat().then((response) => {
      if (response.data.code != 0) {
        navigate("/login")
      } else {
        localStorage.setItem('email', response.data.data.email)
        localStorage.setItem('role', response.data.data.role)
        setRole(response.data.data.role)
      }
    })
  })

  return (
    <div>
      <AppSidebar role={role}/>
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
