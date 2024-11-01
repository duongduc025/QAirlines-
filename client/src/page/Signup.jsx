import { useState } from 'react';
import { Link } from 'react-router-dom'; // Thêm import cho Link
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register',{name,email,password})
        .then((result) => {
            alert("Create a new account successfully"); // Hiện cảnh báo khi đăng ký thành công
            navigate('/login')
        })
        .catch((err) => {
            if (err.response && err.response.data === "Email already in use") {
                alert("This email is already registered. Please use a different email.");
            } else {
                alert("An error occurred during registration. Please try again.");
            }
        });
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
              <h2>Register</h2>

                <form onSubmit = {handleSubmit}>
                    <div className = "mb-3">
                        <label htmlFor = "email">
                            <strong>Name</strong>
                        </label>

                        <input
                            type = "text"
                            placeholder = "Enter your name"
                            autoComplete = "off"
                            name = "email"
                            className = "form-control rounded-0" 
                            onChange = {(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "email">
                            <strong>Email</strong>
                        </label>

                        <input
                            type = "email"
                            placeholder = "Enter your email"
                            autoComplete = "off"
                            name = "email"
                            className = "form-control rounded-0" 
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className = "mb-3">
                        <label htmlFor = "password">
                            <strong>Password</strong>
                        </label>

                        <input
                            type = "password"
                            placeholder = "Enter your password"
                            name = "password"
                            className = "form-control rounded-0" 
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type = "submit" className = "btn btn-success w-100 rounded-0">
                        Register
                    </button>
                    </form>  
                    <p>Already Have an Account</p>
                    <Link to = "/login" className = "btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Login
                    </Link>
            </div>
        </div>
    );
}
export default Signup;