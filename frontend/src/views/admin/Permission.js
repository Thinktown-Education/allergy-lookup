import * as React from 'react'
import { debounce } from 'lodash'
import { 
  CBadge,
  CButton,
  CCard, 
  CCardBody, 
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { DataGrid } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import api from 'src/api/api'
import consts from 'src/utils/consts'
import common from 'src/utils/common'
import './admin.css'

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "role", 
    valueGetter: (param) => {
      return common.getRoleName(param.value)
    },
    headerName: "Role", 
    width: 300},
  { field: "modified",
    headerName: "Last Updated",
    width: 300
  },
];

export default function Permission() {
  console.log(process.env.NODE_ENV)
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [textInput, setTextInput] = React.useState("")

  const [visible, setVisible] = React.useState(false)
  const [deleteVisible, setDeleteVisible] = React.useState(false)
  const [modalTitle, setModalTitle] = React.useState("")
  const [id, setId] = React.useState(0)
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState(0)

  const fetchTable = (query) => {
    setLoading(true)
    api.permission.findUser({
      email: query
    }).then((response) => {
      setLoading(false)
      if (response.data.code == 0) {
        setData(response.data.data)
      } else {
        console.log(response.data.error)
      }
    })
  }

  React.useEffect(() => {
    if (textInput == "" && data.length == 0) {
      fetchTable("")
    }
  })

  const searchUser = debounce((input) => {
    setTextInput(input)
    fetchTable(input)
  }, 500)

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  const openEditModal = (e) => {
    resetModal()
    var item = e.row
    setModalTitle("Edit user's role")
    setId(item.id)
    setEmail(item.email)
    setRole(item.role)
    setVisible(true)
  }

  const resetModal = () => {
    setId(0)
    setEmail("")
    setRole(0)
  }

  const updateUser = () => {
    api.permission.updateUser({
      id: id,
      email: email,
      role: role,
    }).then(response => {
      if (response.data.code == 0) {
        setVisible(false)
        resetModal()
        fetchTable(textInput)
      } else {
        console.log(response.data.error)
      }
    })
  }

  const deleteIngredient = () => {
    api.food.deleteIngredient(id).then(response => {
      if (response.data.code == 0) {
        setVisible(false)
        setDeleteVisible(false)
        resetModal()
        fetchTable(textInput)
      } else {
        console.log(response.data.error)
      }
    })
  }

  const save = () => {
    updateUser()
  }

  return (
    <>
      <CCard>
        <CCardBody>
          <Grid container sx={{ py: 3 }}>
            <Grid item xs={10}>
              <CFormInput
                placeholder="Search user by email"
                aria-label="UserSearch"
                onChange={(e) => searchUser(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }} >
              {loadingIcon()}
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
            pageSizeOptions={[10, 20, 50, 100]}
            onRowClick={openEditModal}
          />
        </CCardBody>
      </CCard>
      <CModal backdrop="static" size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm autoComplete='off'>
          <CFormInput
              hidden
              value={id}
            />
          <Container sx={{ my: 2 }}>
            <CFormInput
              label="Email"
              value={email}
              disabled
            />
          </Container>
          <Container sx={{ my: 2 }}>
            <CFormSelect
              aria-label="Select role"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="0">User</option>
              <option value="1">Editor</option>
              <option value="2">Admin</option>
            </CFormSelect>
          </Container>
        </CForm>
        </CModalBody>
        <CModalFooter className='justify-content-between'>
          <CButton style={id == 0? {visibility: 'hidden'} : {}} color="danger" variant="outline" onClick={() => setDeleteVisible(true)}> Delete </CButton>
          <p>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={(() => save())}>Save changes</CButton>
          </p>
        </CModalFooter>
        <CModal alignment="center" visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
          <CModalHeader>Delete food</CModalHeader>
          <CModalBody>Are you sure you want to delete <b>{email}</b>?</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
              No
            </CButton>
            <CButton color="primary" onClick={(() => deleteIngredient())}>Yes</CButton>
          </CModalFooter>
        </CModal>
      </CModal>
    </>
  )
}