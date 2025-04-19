import React from 'react'

import Footer from './components/Footer.jsx'
import { Outlet } from 'react-router-dom'
import Navbar1 from './components/Navbar.jsx'
function Layout() {
  return (
    <>
    <Navbar1/>
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout