import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Allergy Lookup Website
        </a>
        <span className="ms-1">&copy;</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.thinktown.com" target="_blank" rel="noopener noreferrer">
          Fang
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
