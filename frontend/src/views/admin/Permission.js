import * as React from 'react'
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
  CRow,
  CCol,
  CCardHeader
} from '@coreui/react'
import api from 'src/api/api'
import consts from 'src/utils/consts'
import Container from '@mui/material/Container'
import AsyncSelect from 'react-select/async';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'role', headerName: 'Role', width: 200, editable: true },
  { field: 'roleName', headerName: 'Role Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 200 },
]

function remapRowForDisplay({ id, role, email }) {
  return { id, role, roleName: `${consts.RoleName[role]}`, email }
}

const remapDataForDisplay = (data) => {
  return data.map((item) => remapRowForDisplay(item))
}

export default function Permission() {
  const [data, setData] = React.useState([])
  const [rowUpdated, setRowUpdated] = React.useState(false)
  const [rowData, setRowData] = React.useState([])
  const [visible, setVisible] = React.useState(false)

  const [list, setList] = React.useState([])

  // column record states
  const [rowId, setRowId] = React.useState(0)
  const [rowRole, setRowRole] = React.useState(0)
  const [rowRoleName, setRowRoleName] = React.useState('')
  const [rowEmail, setRowEmail] = React.useState('')
  const [modalTitle, setModalTitle] = React.useState("")

  const fetchTable = (query) => {
    setLoading(true)
    api.permission.findUserByEmail({
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
    return (role in consts.RoleName) ? true : false;
  }


  const resetModal = () => {
    setRowId(0)
    setRowRole(0)
    setRowEmail("")
  }

  const openAddModal = () => {
    resetModal()
    setModalTitle("Change Row Record")
    setVisible(true)
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
      /*
       * to be implemented.
       */
      console.log('Illegal role setting. Reverting row data.')
      setRowUpdated(false)
      setRowData(oldRow)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Role Table</strong>
          </CCardHeader>
          <CCardBody>
            <DataGrid
              editMode='row'
              rows={remapDataForDisplay(data)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              onCellClick={() => openAddModal()}
              processRowUpdate={(newRow, oldRow) => updateRowInDatabase(newRow, oldRow)}
              onProcessRowUpdateError={e => {
                console.log(e)
                /*
                 * e.message == "rowModel is undefined".
                 * No property exists for this TypeError in API doc.
                 * https://mui.com/x/react-data-grid/row-definition/
                 */
              }}
              pageSizeOptions={[10, 20, 50, { value: data.length, label: 'All' }]}
            />
          </CCardBody>
        </CCard>

        {/* Modal */}
        <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>{modalTitle}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm autoComplete='off'>
              <CFormInput
                hidden
                value={rowId}
              />
              <Container sx={{ my: 2 }}>
                <CFormInput
                  label="ID"
                  value={rowId}
                  onInput={(e) => setFoodName(e.target.value)}
                />
              </Container>
              <Container sx={{ my: 2 }}>
                <CFormInput
                  label="Role"
                  value={rowRole}
                  onInput={(e) => setBrand(e.target.value)}
                />
              </Container>
              <Container sx={{ my: 2 }}>
                <CFormInput
                  label="Role Name"
                  value={rowRoleName}
                  onInput={(e) => setImageUrl(e.target.value)}
                />
              </Container>
              <Container sx={{ my: 2 }}>
                <CFormInput
                  label="Email"
                  value={rowEmail}
                  onInput={(e) => setImageUrl(e.target.value)}
                />
              </Container>
              {/* <Container sx={{ my: 4 }}>
                <AsyncSelect
                  styles={"z-index: 2000"}
                  cacheOptions
                  isMulti
                  value={list}
                  loadOptions={loadOptions}
                  onChange={searchIngredients} />
              </Container> */}
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAddVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={(() => save())}>Save changes</CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}
