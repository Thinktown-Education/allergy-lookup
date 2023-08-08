import * as React from 'react'
import { debounce } from 'lodash'
import { CCard, CFormInput, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import api from 'src/api/api'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'user_role', headerName: 'Role', width: 200 },
  { field: 'user_email', headerName: 'Email', width: 200 },
]

export function UserGrid() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [textInput, setTextInput] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  const getPermission = debounce((input) => {
    setTextInput(input)
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
    if (textInput == '' && data.length == 0) {
      console.log('test')
      api.permission.getPermission()
        .then((response) => {
          setLoading(false)
          if (response.data.code == 0) {
            setData(response.data.data)
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
        <Grid
          item
          xs={1}
          style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
        >
          <Button variant="outlined" onClick={() => setVisible(!visible)}>
            {' '}
            Add{' '}
          </Button>
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
