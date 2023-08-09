import * as React from 'react'
import { debounce, set } from 'lodash'
import { CCard, CFormInput, CCardBody, CCardHeader, CCol, CRow, CForm, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { DataGrid, GridCellParams, GridCellModes, GridCellModesModel, GridRowsProp, GridColDef, GridCell, useGridApiRef } from '@mui/x-data-grid'
import Container from '@mui/material/Container'
import AsyncSelect from 'react-select/async';

import api from 'src/api/api'

import consts from 'src/utils/consts'

const roleNames = consts.RoleName

function remapRowForDisplay ({ id, role, email }) {
  console.log(`${id}, ${role}, ${email}`)
  console.log(roleNames)
  return { id, role, roleName: `${roleNames[role]}`, email }
}


const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'role', headerName: 'Role', width: 200, editable: true },
  { field: 'roleName', headerName: 'Role Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 200 },
]

const remapDataForDisplay = (data) => {
  const newData= data.map((item) => remapRowForDisplay(item))
  console.log(newData)
  return newData
}

export function UserGrid() {
  const [data, setData] = React.useState([])
  const [rowUpdated, setRowUpdated] = React.useState(false)
  const [rowData, setRowData] = React.useState([])

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
    return (role in roleNames) ? true : false;
  }

  /**
   * Make `POST` request containing row record with updated role.
   * 
   * @param {*} newRow 
   * @param {*} oldRow 
   */
  async function updateRow(newRow, oldRow) {
    console.log(newRow)
    console.log(oldRow)
    /*
      check for legal role.
        - If legal, proceed.
        - If not legal, reset row data.
     */
    const isLegal = isLegalRole(Number(newRow['role']))
    console.log('is legal role:', isLegal)
    if (isLegal) {
      setRowUpdated(true)
      const requestBody = { id: newRow['id'], role: newRow['role'] }
      try {
        const response = await api.permission.updatePermission(requestBody)
        if (response.data.code != 0) {
          throw new Error('cannot post new row record to /permission')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Illegal role setting. Reverting row data.')
      setRowUpdated(false)
      setRowData(oldRow)
    }
  }

  return (
    <>
      <DataGrid
        editMode='row'
        rows={remapDataForDisplay(data)}
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
