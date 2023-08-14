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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { DataGrid } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import common from 'src/utils/common'
import api from 'src/api/api'
import './editor.css'

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "ing_name", headerName: "Name", width: 300 },
  { field: "modified",
    headerName: "Last Updated",
    width: 300
  },
];

export default function Ingredients() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [textInput, setTextInput] = React.useState("")

  const [visible, setVisible] = React.useState(false)
  const [deleteVisible, setDeleteVisible] = React.useState(false)
  const [modalTitle, setModalTitle] = React.useState("")
  const [id, setId] = React.useState(0)
  const [ingredientName, setIngredientName] = React.useState("")

  const fetchTable = (query) => {
    setLoading(true)
    api.food.findIngredients({
      name: query
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

  const searchIngredients = debounce((input) => {
    setTextInput(input)
    fetchTable(input)
  }, 500)

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  const openAddModal = () => {
    resetModal()
    setModalTitle("Add new ingredient")
    setVisible(true)
  }

  const openEditModal = (e) => {
    resetModal()
    var item = e.row
    setModalTitle("Edit ingredient")
    setId(item.id)
    setIngredientName(item.ing_name)
    setVisible(true)
  }

  const resetModal = () => {
    setId(0)
    setIngredientName("")
  }

  const addIngredient = () => {
    api.food.addIngredient({
      ing_name: ingredientName
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

  const editIngredient = () => {
    api.food.editIngredient({
      id: id,
      ing_name: ingredientName,
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
    if (id == 0) {
      addIngredient()
    } else {
      editIngredient()
    }
  }

  return (
    <>
      <CCard>
        <CCardBody>
          <Grid container sx={{ py: 3 }}>
            <Grid item xs={10}>
              <CFormInput
                placeholder="Search ingredient name"
                aria-label="IngredientSearch"
                onChange={(e) => searchIngredients(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }} >
              {loadingIcon()}
            </Grid>
            <Grid item xs={1}  style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} >
              <Button variant="outlined" onClick={() => openAddModal()}> Add </Button>
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
              label="Ingredient name"
              value={ingredientName}
              onInput={(e) => setIngredientName(e.target.value)}
            />
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
          <CModalBody>Are you sure you want to delete <b>{ingredientName}</b>?</CModalBody>
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