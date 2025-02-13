import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './loginpage.css';
import logo from '../assets/mediconnect.png';
import LoginImage from '../assets/login.png';
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginPage = () => {
    const [contactInfo, setContactInfo] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
  
    const navigate = useNavigate();
  
    // Load saved contactInfo if "Remember Me" was previously checked
    useEffect(() => {
        const savedContactInfo = localStorage.getItem('remembered_contact');
        if (savedContactInfo) {
            setContactInfo(savedContactInfo);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                contactInfo,
                password,
            });
    
            const { access_token, Role } = response.data;
    
            // Store the token and role in localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('role', Role); // Store the user's role here
            localStorage.setItem('user_email', contactInfo); // لا داعي لإرجاع الإيميل من Spring Boot
    
            // If "Remember Me" is checked, save the email/contact info
            if (rememberMe) {
                localStorage.setItem('remembered_contact', contactInfo);
            } else {
                localStorage.removeItem('remembered_contact'); // Clear saved contact info if unchecked
            }
    
            // Clear any previous error messages
            setErrorMessage('');

            // ✅ إذا كان المستخدم "DOCTOR"، يتم تسجيل الدخول في Firebase أيضًا
            if (Role === 'DOCTOR') {
                try {
                    const firebaseUser = await signInWithEmailAndPassword(auth, contactInfo, password);
                    const firebaseUID = firebaseUser.user.uid;
                    localStorage.setItem('userID', firebaseUID); // ✅ تخزين userID من Firebase

                    console.log("Firebase Login Success:", firebaseUser.user);
                } catch (firebaseError) {
                    console.error("Firebase login failed:", firebaseError.message);
                    setErrorMessage('Login successful on backend, but failed on Firebase. Contact support.');
                    return;
                }
            }
    
            // Navigate based on the user's role
            if (Role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (Role === 'DOCTOR') {
                navigate('/doctor-dashboard');
            } else {
                console.error('Unknown role:', Role);
            }

        } catch (error) {
            // Check if the error has a response with status code
            if (error.response) {
                if (error.response.status === 403) {
                    setErrorMessage('Incorrect email or password. Please try again.');
                } else {
                    setErrorMessage('An error occurred. Please try again later.');
                }
            } else {
                setErrorMessage('Network error. Please check your connection.');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-page">
            {/* Left Image Section */}
            <div className="login-left">
                <img src={LoginImage} alt="Healthcare professionals" className="login-image" />
                <div className="image-text">
                    <h1>MediConnect</h1>
                    <p>Start your journey to better health</p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="login-right">
                <img src={logo} alt="Logo" className="logo" />
                <h2>Welcome to MediConnect!</h2>
                <p className="subtext">
                    Empowering you to access reliable healthcare insights and expert medical advice anytime, anywhere
                </p>
                
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Enter your Email"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                {/* Display error message */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="form-footer">
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label>Remember me</label>
                    </div>
                    <a href="/forgot-password">Forgot Password?</a>
                </div>

                <button onClick={handleLogin} className="login-button">Login</button>
            </div>
        </div>
    );
};

export default LoginPage;
