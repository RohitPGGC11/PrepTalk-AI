import React, { useContext, useState } from 'react'
import axios from 'axios'
import './Login.css'
import { userContext } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
const Login = () => {

  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false)
  const { url ,setToken } = useContext(userContext)
  const [formData, setformData] = useState({
    email: "",
    password: "",
  })
  
    const onChangeHandler = (e) => {
      setformData({
        ...formData,
        [e.target.name]: e.target.value
      })
      console.log(url)
    }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const token = localStorage.getItem("token");
      const response = await axios.post(`${url}/api/user/login`, formData, {headers:{Authorization:`Bearer ${token}`}})
      if (response.data.success) {
        console.log(response.data.message);
        navigate("/Home");
      }
      else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error);

    }finally{
      setLoading(false)
    }

  }


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmitHandler}>
        <h2>Login</h2>

  

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChangeHandler}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChangeHandler}
        />
        <div className="auth-switch">
        <span>First time here?</span>
        <Link to="/register">Create an account</Link>
      </div>

        <button type='submit' disabled={Loading}>
          {Loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
