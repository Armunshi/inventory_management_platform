import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, Router } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import { UserContextProvider } from './context/UserContext'
import LoginPage from './Pages/Login'
import Layout from './Layout'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<Layout/>}>
        <Route path='signup' element={<SignUp/>}/>
        <Route path = 'login' element={<LoginPage/>}/>
        <Route path='user/:role' element={<Profile/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router ={router}/>
    </UserContextProvider>
  </StrictMode>,
)
