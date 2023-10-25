import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilUser, cilLockUnlocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import profile from 'src/assets/images/avatars/default.jpg'
import api from 'src/api/api'
import common from 'src/utils/common'

const AppHeaderDropdown = () => {
  const displayEmail = localStorage.getItem('email')
  const roleName = common.getRoleName(localStorage.getItem('role'))

  const logout = async (e) => {
    e.preventDefault()
    api.auth.logout().then(() => {
      window.location.href = '/'
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={profile} size="md" />
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end">
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {displayEmail}
        </CDropdownItem>
        <CDropdownItem href="#" disabled>
          <CIcon icon={cilLockUnlocked} className="me-2" />
          {roleName}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={logout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
