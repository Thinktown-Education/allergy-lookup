import * as React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
export default function Ingredients() {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Search Table</strong>
          </CCardHeader>
          <CCardBody>
            body
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
