import * as React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip';
import AsyncSelect from 'react-select/async';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import api from 'src/api/api'
import common from 'src/utils/common'

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
        <Grid container sx={{ p: 3 }}>
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
  const [list, setList] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const searchFood = debounce((food) => {
    if (!common.isEmpty(food)) {
      setLoading(true)
      api.food.findFood(food).then((response) => {
        setLoading(false)
        if (response.data.code == 0) {
          setList(response.data.data)
        } else {
          console.log(response.data.error)
        }
      })
    }
    console.log('Searching: ' + food)
  }, 500)

  const loadOptions = debounce((input, callback) => {
    if (!common.isEmpty(input)) {
      api.food.findIngredients(input).then((response) => {
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
          setList(response.data.data)
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

  const populateTable = (item, index) => {
    return (
      <CTableRow key={index}>
        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
        <CTableDataCell>{item['food_name']}</CTableDataCell>
        <CTableDataCell>{item['brand']}</CTableDataCell>
        <CTableDataCell>{item['ingredients'] && 
          item['ingredients'].map((item, index) => populateIngredients(item, index))}</CTableDataCell>
      </CTableRow>
    )
  }

  const populateIngredients = (item, index) => {
    return <Chip key={index} label={item['ing_name']} />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Search Table</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p>
            <div>
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
              <TableContainer>
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Ingredients</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <React.Fragment>
                      {list && list.map((item, index) => populateTable(item, index))}
                    </React.Fragment>
                  </CTableBody>
                </CTable>
              </TableContainer>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
