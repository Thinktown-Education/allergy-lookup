import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch, cilUserPlus } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import consts from 'src/utils/consts'

var menu = {
  build(role) {
    var nav = [
      {
        component: CNavItem,
        name: 'Search',
        to: '/search',
        icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
      },
    ]

    if (role >= consts.Role.EDITOR) {
      nav.push(
        {
          component: CNavTitle,
          name: 'Editor',
        },
        {
          component: CNavItem,
          name: 'Edit Food',
          to: '/editor/food',
          icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Edit Ingredients',
          to: '/editor/ingredients',
          icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
        },
      )
    }

    if (role >= consts.Role.ADMIN) {
      nav.push(
        {
          component: CNavTitle,
          name: 'Admin',
        },
        {
          component: CNavItem,
          name: 'Permission',
          to: '/admin/permission',
          icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
        },
      )
    }
    return nav
  },
}

export default menu
