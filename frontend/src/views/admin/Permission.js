import * as React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { UserGrid } from "./userGrid/UserGrid.js"

export default function Permission() {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Search Table</strong>
          </CCardHeader>
          <CCardBody>
            <h1>placeholder body</h1>
            <UserGrid />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
