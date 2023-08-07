import * as React from 'react'
import { debounce } from 'lodash'
import { 
  CButton,
  CCard, 
  CCardBody, 
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { DataGrid } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import common from 'src/utils/common'
import api from 'src/api/api'
import './editor.css'

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "food_name", headerName: "Name", width: 200 },
  { field: "brand", headerName: "Brand", width: 200 },
  { field: "modified",
    headerName: "Last Updated",
    width: 400
  },
];

export default function Food() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [textInput, setTextInput] = React.useState("")
  const [visible, setVisible] = React.useState(false)

  const searchFood = debounce((input) => {
    setTextInput(input)
    setLoading(true)
    api.food.findFood({
      name: input
    }).then((response) => {
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
    if (textInput == "" && data.length == 0) {
      console.log('test')
      api.food.findFood({
        name: ""
      }).then((response) => {
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
      <CCard>
        <CCardBody>
          <Grid container sx={{ py: 3 }}>
            <Grid item xs={10}>
              <CFormInput
                placeholder="Search food name or brand name"
                aria-label="FoodSearch"
                onChange={(e) => searchFood(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }} >
              {loadingIcon()}
            </Grid>
            <Grid item xs={1}  style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} >
              <Button variant="outlined" onClick={() => setVisible(!visible)}> Add </Button>
            </Grid>
          </Grid>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 }
              }
            }}
            pageSizeOptions={[10, 20, 50, { value: data.length, label: 'All' }]}
          />
        </CCardBody>
      </CCard>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Add new food</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="food-name"
                label="Food name"
              />
              <TextField
                id="food-brand"
                label="Brand"
              />
            </div>
          </Box>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}