import * as React from 'react'
import { debounce, update } from 'lodash'
import { DataGrid } from '@mui/x-data-grid'
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
  CForm,
  CCardHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import api from 'src/api/api'
import consts from 'src/utils/consts'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'role', headerName: 'Role', width: 200, editable: true },
  { field: 'roleName', headerName: 'Role Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 200 },
]

function remapRowForDisplay({ id, role, email }) {
  return { id, role, roleName: `${consts.RoleName[role]}`, email }
}

function remapDataForDisplay(data) {
  return data.map((item) => remapRowForDisplay(item))
}

function updateTable(table, row) {
  return table.map((item) => {
    return item.id != row.id ? item : { ...item, role: row.role }
  })
}

export default function Permission() {
  const [table, setTable] = React.useState([])
  const [rowUpdated, setRowUpdated] = React.useState(false)
  const [rowData, setRowData] = React.useState([])
  const [visible, setVisible] = React.useState(false)
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [textInput, setTextInput] = React.useState('')

  // column record states
  const [rowId, setRowId] = React.useState(0)
  const [rowRole, setRowRole] = React.useState(0)
  const [rowRoleName, setRowRoleName] = React.useState('')
  const [rowEmail, setRowEmail] = React.useState('')
  const [modalTitle, setModalTitle] = React.useState('')

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  const searchUser = debounce((input) => {
    setTextInput(input)
    fetchTable(input)
  }, 500)

  const fetchTable = async (query) => {
    setLoading(true)
    const response = await api.permission.findUser({
      email: query,
    })
    setLoading(false)
    if (response.data.code == 0) {
      setTable(response.data.data)
    } else {
      console.log(response.data.error)
    }
  }

  React.useEffect(() => {
    if (textInput == '' && table.length == 0) {
      fetchTable('')
    }
  }, [])

  function isLegalRole(role) {
    return role in consts.RoleName ? true : false
  }

  const openEditModal = (params, event) => {
    setModalTitle('Edit User Record')
    setRowData(params.row)
    setRowId(params.row.id)
    setRowRole(params.row.role)
    setRowRoleName(params.row.roleName)
    setRowEmail(params.row.email)
    setVisible(true)
  }

  const openErrorModal = () => {
    setErrorVisible(true)
  }

  /**
   * Makes a `POST` request containing row record with updated role.
   *
   * @param {*} newRow
   * @param {*} oldRow
   */
  async function updateRowInDatabase(newRow, oldRow) {
    /*
      check for legal role.
        - If legal, proceed.
        - If not legal, reset row data.
     */
    const isLegal = isLegalRole(Number(newRow['role']))
    console.log('is legal role:', isLegal)
    if (isLegal) {
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
      /*
       * TODO: replace alert with an UI popup.
       */
      alert('Illegal role value. Reverting row data.')
      setTable(updateTable(table, oldRow))
    }
  }

  const save = () => {
    const newRow = { ...rowData, role: rowRole }
    const newTable = updateTable(table, newRow)
    setTable(newTable)
    updateRowInDatabase(newRow, rowData)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>User Role Table</strong>
        </CCardHeader>
        <CCardBody>
          <Grid container sx={{ py: 3 }}>
            <Grid item xs={12}>
              <CFormInput
                placeholder="Search User By Email"
                aria-label="User Search"
                onChange={(e) => searchUser(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
              {loadingIcon()}
            </Grid>
          </Grid>
          <DataGrid
            editMode="row"
            rows={remapDataForDisplay(table)}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            onCellClick={openEditModal}
            processRowUpdate={(newRow, oldRow) => updateRowInDatabase(newRow, oldRow)}
            onProcessRowUpdateError={(e) => {
              console.log(e)
              /*
               * e.message == "rowModel is undefined".
               * rowModel is not found in API doc for this component.
               * https://mui.com/x/react-data-grid/row-definition/
               */
            }}
            pageSizeOptions={[10, 20, 50, { value: table.length, label: 'All' }]}
          />
        </CCardBody>
      </CCard>

      {/* Modal */}
      <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm autoComplete="off">
            <Container sx={{ my: 2 }}>
              <CFormInput label="ID" value={rowId} disabled />
            </Container>
            <Container sx={{ my: 2 }}>
              <CFormInput
                label="Role"
                value={rowRole}
                onInput={(e) => {
                  if (isLegalRole(e.target.value)) {
                    setRowRole(e.target.value)
                  } else {
                    openErrorModal()
                  }
                }}
              />
            </Container>
            <Container sx={{ my: 2 }}>
              <CFormInput label="Role Name" value={rowRoleName} disabled />
            </Container>
            <Container sx={{ my: 2 }}>
              <CFormInput label="Email" value={rowEmail} disabled />
            </Container>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={save}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal */}
      <CModal backdrop="static" alignment="center" visible={errorVisible} onClose={() => setErrorVisible(false)}>
        <CModalHeader onClose={() => setErrorVisible(false)}>
        </CModalHeader>
        <CModalBody>
          <Container sx={{ my: 2 }}>
            Incorrect Role Value. Please enter a valid role value.
          </Container>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setErrorVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
