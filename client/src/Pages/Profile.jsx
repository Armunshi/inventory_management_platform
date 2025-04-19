import { UserContext } from '@/context/UserContext';
import React, { useContext } from 'react'
// import { use } from 'react'
import { useLocation } from 'react-router-dom'

const Profile = () => {
    
    const {user} = useContext(UserContext);

 if (user.role =='admin') {return (
    <div>
        
    </div>
  )}
  else if (user.role=='supplier') {
    return(
        <div>

        </div>
    )
  }
  else{
    return (
        <>
        </>
    )
  }
}

export default Profile