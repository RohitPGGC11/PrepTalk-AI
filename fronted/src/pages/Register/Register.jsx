import { useContext, useState } from 'react'
import './Register.css'
import { userContext } from '../../contexts/userContext'
import { Link,useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-toastify'

const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [Loading, setLoading] = useState(false)
  const { setToken } = useContext(userContext)

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await api.post("/api/user-login/register", formData)
      if (response.data.success) {
        localStorage.setItem("token",response.data.accessToken)
        setToken(response.data.accessToken);
        toast.success(response.data.message || "Registeration Successful");
        navigate("/")

      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration Faild")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmitHandler}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={onChangeHandler}
          required
        />

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
          <span>Already have an account?</span>
          <Link to="/login">Login here</Link>
        </div>

        <button type='submit' disabled={Loading}>
          {Loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default Register