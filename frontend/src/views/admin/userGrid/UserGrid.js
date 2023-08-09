import * as React from 'react'
import { debounce, set } from 'lodash'
import { CCard, CFormInput, CCardBody, CCardHeader, CCol, CRow, CForm, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { DataGrid, GridCellParams, GridCellModes, GridCellModesModel, GridRowsProp, GridColDef, GridCell, useGridApiRef } from '@mui/x-data-grid'
import Container from '@mui/material/Container'
import AsyncSelect from 'react-select/async';

import api from 'src/api/api'

import consts from 'src/utils/consts'

const roles = consts.Role
const roleNames = consts.RoleName

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'role', headerName: 'Role', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 200 },
]

const remapRowForDBCommit = ({ id, role, email }) => {
  return { id, role: roles[role], email }
}

const remapRowForDisplay = ({ id, role, email }) => {
  return { id, role: roleNames[role], email }
}

const remapDataForDisplay = (data) => {
  return data.map((item) => remapRowForDisplay(item))
}

export function UserGrid() {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.permission.getPermission()
        if (response.data.code != 0) {
          throw new Error('cannot fetch users from /permission')
        }
        setData(response.data.data)
      }
      catch (error) {
        console.log(response.data.error)
      }
    }
    fetchUsers()
  }, [])

  function isLegalRole(role) {
    return (role in roles) ? true : false;
  }

  /*
   * TODO:
   *  add function to handle illegal Role
   */

  /**
   * Make `POST` request containing row record with updated role.
   * 
   * @param {*} newRow 
   * @param {*} oldRow 
   */
  async function updateRow(newRow, oldRow) {
    console.log(newRow)
    /*
      check for legal role.
        - If legal, proceed.
        - If not legal, reset row data.
     */
    const legalRole = isLegalRole(Number(newRow['role']))
    if (legalRole) {
      const requestBody = { id: newRow['id'], role: newRow['role'] }
      try {
        const response = await api.permission.updatePermission(requestBody)
        if (response.data.code != 0) {
          throw new Error('cannot fetch users from /permission')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Illegal role setting. Reverting row data.')
    }
  }

  return (
    <>
      <DataGrid
        editMode='row'
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        processRowUpdate={(newRow, oldRow) => { updateRow(newRow, oldRow) }}
        onProcessRowUpdateError={e => console.log(e.message)}
        pageSizeOptions={[10, 20, 50, { value: data.length, label: 'All' }]}
      />
    </>
  )
}
