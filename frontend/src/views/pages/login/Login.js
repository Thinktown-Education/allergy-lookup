/* eslint-disable react/no-unescaped-entities */
import { React, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import api from 'src/api/api'
import common from 'src/utils/common'

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [toast, addToast] = useState(0)
  // const [errorMessage, setErrorMessage] = useState('')
  const toaster = useRef()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate()

  const loginClick = async (e) => {
    e.preventDefault()
    if (common.isEmpty(email) || common.isEmpty(password)) {
      addToast(errorToast('Cannot enter empty field'))
    } else {
      api.auth
        .login({
          email,
          password,
        })
        .then((response) => {
          if (response.data.code == 0) {
            navigate('/')
          } else {
            addToast(errorToast('Incorrect email or password'))
          }
        })
    }
  }

  const forgetClick = async (e) => {
    addToast(errorToast('Feature not ready'))
  }

  const errorToast = (errorMessage) => (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#ff0000"></rect>
        </svg>
        <div className="fw-bold me-auto">Fang's Allergy</div>
        <small>Now</small>
      </CToastHeader>
      <CToastBody>{errorMessage}</CToastBody>
    </CToast>
  )

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h2>Allergy Lookup by Fang</h2>
                    <p className="text-medium-emphasis">Sign in to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="px-4"
                          onClick={loginClick}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0" onClick={forgetClick}>
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h4 style={{ marginBottom: '80px' }}>
                      Don't have an account?
                      <br /> Register now
                    </h4>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Login
