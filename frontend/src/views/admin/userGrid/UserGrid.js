import * as React from 'react'
import { debounce } from 'lodash'
import { CCard, CFormInput, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

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
  { field: 'modified', headerName: 'Last Updated', width: 400 },
]

export function UserGrid() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  let gridData;
  const [textInput, setTextInput] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  const getPermission = debounce((input) => {
    setLoading(true)
    api.permission.getPermission()
      .then((response) => {
        setLoading(false)
        if (response.data.code == 0) {
          setData(response.data.data)
        } else {
          console.log(response.data.error)
        }
      })
  }, 500)

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  React.useEffect(() => {
    if (data.length == 0) {
      console.log('test')
      api.permission.getPermission()
        .then((response) => {
          setLoading(false)
          if (response.data.code == 0) {
            console.log(response.data.data)
            const data = response.data.data.map((item) => {
              const { id, role, email, modified } = item
              return { id, role: roles[role], email, modified }
            })
            setData(data)
          } else {
            console.log(response.data.error)
          }
        })
    }
  })

  return (
    <>
      <Grid container sx={{ py: 3 }}>
        <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
          {loadingIcon()}
        </Grid>
      </Grid>
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
