import * as React from 'react'
import { debounce } from 'lodash'
import { CCard, CFormInput, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DataGrid, GridCellParams, GridCellModes, GridCellModesModel, GridRowsProp, GridColDef, GridCell, useGridApiRef } from '@mui/x-data-grid'

import api from 'src/api/api'

const roles = {
  0: "USER",
  1: "EDITOR",
  2: "ADMIN",
}

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'role', headerName: 'Role', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
]

const mapData = (data) => {
  const mapDataItem = ({ id, role, email }) => {
    return { id, role: roles[role], email }
  }
  return data.map((item) => mapDataItem(item))
}

export function UserGrid() {
  const [data, setData] = React.useState([])
  const [cell, setCell] = React.useState({})

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.permission.getPermission()
        console.log(response)
        if (response.data.code != 0) {
          throw new Error('cannot fetch users from /permission')
        }
        const rowData = mapData(response.data.data)
        console.log(rowData)
        setData(rowData)
      }
      catch (error) {
        console.log(response.data.error)
      }
    }
    fetchUsers()
  }, [])

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50, { value: data.length, label: 'All' }]}
      />
    </>
  )
}
