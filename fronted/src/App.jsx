import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Chat from './pages/Chat/Chat'
import AdminDashboard from './pages/Admin/AdminDashboard'
import EditForm from './components/admin/editform'

const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Home" element={<Login/>}></Route>
      <Route path="/Register" element={<Register/>}></Route>
      <Route path="/chat" element={<Chat/>}></Route>
      <Route path="/admin" element={<AdminDashboard/>}></Route>
      <Route path="/admin/edit-form/:id" element={<EditForm/>}></Route>
    </Routes>
    </div>
  )
}


export default App
