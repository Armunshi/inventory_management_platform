import { useState } from 'react'
import LoginPage from './Pages/login'
import './App.css'
import { UserContextProvider} from '@/context/UserContext'
function App() {
  return (
    <>
    <UserContextProvider>
      <LoginPage/>
      
    </UserContextProvider>
    </>
  )
}

export default App
