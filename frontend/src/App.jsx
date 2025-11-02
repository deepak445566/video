import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Call from './pages/Call'
import Chat from './pages/Chat'
import OnBoarding from './pages/OnBoarding'
import Notification from './pages/Notification'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
    <div className='h-screen'data-theme="coffee">

<Routes>
<Route path='/' element={<Home/>}/>
<Route path='/signup' element={<SignUp/>}/>
<Route path='/login' element={<Login/>}/>
<Route path='/notification' element={<Notification/>}/>
<Route path='/onboarding' element={<OnBoarding/>}/>
<Route path='/chat' element={<Chat/>}/>
<Route path='/call' element={<Call/>}/>

</Routes>


    </div>
  )
}

export default App