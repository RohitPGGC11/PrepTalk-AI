import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Chat from './pages/Chat/Chat'
import AdminDashboard from './pages/Admin/AdminDashboard'
import EditForm from './components/admin/editform'
import DomainSelector from './pages/DomainSelector/DomainSelector'
import ProtectedLayout from './components/protectedRoute/ProtectedRoute'

import axios from "axios";
axios.defaults.withCredentials = true; 

const App = () => {
  return (
    <div>
    <Routes>
      {/* Home PAGE */}
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Register" element={<Register/>}></Route>

      <Route element={<ProtectedLayout/>}>
      {/* USER ORIENTED */}
      <Route path="/admin" element={<AdminDashboard/>}></Route>
      <Route path="/admin/edit-form/:id" element={<EditForm/>}></Route>

      {/* CHAT AND ANYLATICS */}
      <Route path="/chat/:sessionId" element={<Chat/>}></Route>
      <Route path="/domain" element={<DomainSelector/>}></Route>
      </Route>

    </Routes>
    </div>
  )
}


export default App
