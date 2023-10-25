import * as React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { DataGrid } from "@mui/x-data-grid";
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip';
import AsyncSelect from 'react-select/async';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
  CBadge,
  CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import api from 'src/api/api'
import common from 'src/utils/common'

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
          (<CBadge color='primary' shape='rounded-pill' key={index}>{item.ing_name}</CBadge>))}
      </>
      )
    })
  },
  { field: "modified",
    headerName: "Last Updated",
    width: 300
  },
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container sx={{ py: 3 }}>
          {children}
        </Grid>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function Search() {
  const [value, setValue] = React.useState(0)

  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [foodName, setFoodName] = React.useState("")
  const [brand, setBrand] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [list, setList] = React.useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const openEditModal = (e) => {
    resetModal()
    var item = e.row
    setBrand(item.brand)
    setFoodName(item.food_name)
    setImageUrl(item.image_url)
    setList(item.ingredients.map(x => ({value: x.id, label: x.ing_name})))
    setVisible(true)
  }

  const resetModal = () => {
    setFoodName("")
    setBrand("")
    setImageUrl("")
    setList([])
  }

  const searchFood = debounce((food) => {
    if (!common.isEmpty(food)) {
      setLoading(true)
      api.food.findFood({
        name: food
      }).then((response) => {
        setLoading(false)
        if (response.data.code == 0) {
          setData(response.data.data)
        } else {
          console.log(response.data.error)
        }
      })
    }
    console.log('Searching: ' + food)
  }, 500)

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

  const searchIngredients = debounce((ids) => {
    if (!common.isEmpty(ids)) {
      setLoading(true)
      ids = ids.map(item => item.value)
      var requestBody = {ingredients: ids}
      api.food.findFoodByIngredients(requestBody).then((response) => {
        setLoading(false)
        if (response.data.code == 0) {
          setData(response.data.data)
        } else {
          console.log(response.data.error)
        }
      })
    }
  }, 500)

  const loadingIcon = () => {
    if (loading) {
      return <CIcon icon={cilCloudDownload} />
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Search Table</strong>
        </CCardHeader>
        <CCardBody>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Food" {...a11yProps(0)} />
              <Tab label="Ingredients" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Grid item xs={10}>
              <CFormInput
                placeholder="Search food name or brand name"
                aria-label="FoodSearch"
                aria-describedby="basic-addon1"
                onChange={(e) => searchFood(e.target.value)}
              />
            </Grid>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} >
              {loadingIcon()}
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Grid item xs={10}>
              <AsyncSelect cacheOptions isMulti loadOptions={loadOptions} onChange={searchIngredients}/>
            </Grid>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              {loadingIcon()}
            </Grid>
          </CustomTabPanel>
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
      <CModal size="xl" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>{foodName}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Container sx={{ my: 2 }}>
            Brand: {brand}
          </Container>
          <Container sx={{ my: 2 }}>
            Ingredients: {list.map((item, index) => 
                  (<CBadge 
                    color='primary' 
                    shape='rounded-pill'
                    sx={{ mx: 2 }}
                    key={index}>
                      {item.label}
                  </CBadge>))}
          </Container>
          <Container>
            <CImage fluid src={imageUrl} />
          </Container>
        </CModalBody>
        <CModalFooter className='justify-content-end'>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
