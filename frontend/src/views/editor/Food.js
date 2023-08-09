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
import AsyncSelect from 'react-select/async';

import common from 'src/utils/common'
import api from 'src/api/api'
import './editor.css'

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "food_name", headerName: "Name", width: 200 },
  { field: "brand", headerName: "Brand", width: 200 },
  { 
    field: "ingredients",
    headerName: "Ingredients",
    flex: 1,
    renderCell: (params => {
      return (
      <>
        {params.value.map((item, index) => 
          (<CBadge color='success' shape='rounded-pill' key={index}>{item.ing_name}</CBadge>))}
      </>
      )
    })
  },
  { field: "modified",
    headerName: "Last Updated",
    width: 300
  },
];

export default function Food() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [textInput, setTextInput] = React.useState("")

  const [visible, setVisible] = React.useState(false)
  const [modalTitle, setModalTitle] = React.useState("")
  const [id, setId] = React.useState(0)
  const [foodName, setFoodName] = React.useState("")
  const [brand, setBrand] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [list, setList] = React.useState([])

  const fetchTable = (query) => {
    setLoading(true)
    api.food.findFood({
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

  const searchFood = debounce((input) => {
    setTextInput(input)
    fetchTable(input)
  }, 500)

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  const loadOptions = debounce((input, callback) => {
    if (!common.isEmpty(input)) {
      api.food.findIngredients({
        name: input
      }).then((response) => {
        if (response.data.code == 0) {
          var options = []
          response.data.data.forEach(item => {
            options.push({
              value: item['id'],
              label: item['ing_name'],
            })
          });
          callback(options)
        } else {
          console.log(response.data.error)
        }
      })
    }
  }, 500)

  const searchIngredients = (items) => {
    setList(items)
  }

  const openAddModal = () => {
    resetModal()
    setModalTitle("Add new food")
    setVisible(true)
  }

  const openEditModal = (e) => {
    var item = e.row
    setModalTitle("Edit food")
    setId(item.id)
    setBrand(item.brand)
    setFoodName(item.food_name)
    setImageUrl("")
    setList(item.ingredients.map(x => ({value: x.id, label: x.ing_name})))
    setVisible(true)
  }

  const resetModal = () => {
    setId(0)
    setFoodName("")
    setBrand("")
    setImageUrl("")
  }

  const addFood = () => {
    api.food.addFood({
      id: id,
      food_name: foodName,
      brand: brand,
      image_url: imageUrl,
      ingredients: list.map(x => x.value)
    }).then(response => {
      if (response.data.code == 0) {
        setVisible(false)
        fetchTable(textInput)
      } else {
        console.log(response.data.error)
      }
    })
  }

  const editFood = () => {
    api.food.editFood({
      id: id,
      food_name: foodName,
      brand: brand,
      image_url: imageUrl,
      ingredients: list.map(x => x.value)
    }).then(response => {
      if (response.data.code == 0) {
        setVisible(false)
        fetchTable(textInput)
      } else {
        console.log(response.data.error)
      }
    })
  }

  const save = () => {
    if (id == 0) {
      addFood()
    } else {
      editFood()
    }
  }

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
      <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
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
              label="Food name"
              value={foodName}
              onInput={(e) => setFoodName(e.target.value)}
            />
          </Container>
          <Container sx={{ my: 2 }}>
            <CFormInput
              label="Brand"
              value={brand}
              onInput={(e) => setBrand(e.target.value)}
            />
          </Container>
          <Container sx={{ my: 2 }}>
            <CFormInput
              label="Image Url"
              value={imageUrl}
              onInput={(e) => setImageUrl(e.target.value)}
            />
          </Container>
          <Container sx={{ my: 4 }}>
            <AsyncSelect 
              styles={ "z-index: 2000" }
              cacheOptions 
              isMulti 
              value={list}
              loadOptions={loadOptions} 
              onChange={searchIngredients}/>
          </Container>
        </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={(() => save())}>Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}