import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'

const Brightness = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Brightness
          <DocsLink href="https://coreui.io/docs/utilities/colors/" />
        </CCardHeader>
        <CCardBody>
          <p>Landing component for Brightness button.</p>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Brightness
