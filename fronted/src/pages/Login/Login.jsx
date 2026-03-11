import { useContext, useState } from 'react'
import './Login.css'
import { userContext } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-toastify'
const Login = () => {

  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false)
  const { setToken } = useContext(userContext)
  const [formData, setformData] = useState({
    email: "",
    password: "",
  })
  
    const onChangeHandler = (e) => {
      setformData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await api.post(`/api/user-login/login`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
        setToken(response.data.accessToken);
        toast.success(response.data.message);
        navigate("/");

      }
    } catch (error) {
  console.log(error);
  toast.error(error.response?.data?.message || "Login failed");
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
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChangeHandler}
          required
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
