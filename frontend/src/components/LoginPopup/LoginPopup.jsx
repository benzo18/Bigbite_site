import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import validator from "validator";
import { authUrl } from './auth.js';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));

    // Validation checks
    if (name === "email") {
      if (!validator.isEmail(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    } else if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
      } else {
        setPasswordError("");
      }
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();

    // If there are validation errors, prevent submission
    if (emailError || passwordError) {
      alert("Please fix the validation errors.");
      return;
    }

    const newUrl =
      currState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        console.log("Generated token:", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        console.error("Login error:", response.data.message);
        alert(`Login failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const testLocalStorage = () => {
    try {
      localStorage.setItem("testKey", "testValue");
      console.log("localStorage test successful!");
    } catch (error) {
      console.error("localStorage test failed:", error);
    }
  };

  testLocalStorage();

  const handleGoogleSignIn = () => {
    window.location.href = authUrl; // Redirect to authUrl
  };

  const handleGoogleSignInSuccess = async (response) => {
    try {
      const res = await axios.post(`${url}/api/user/google-login`, {
        credential: response.credential,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setShowLogin(false);
      } else {
        console.error("Google login error:", res.data.message);
        alert(`Login failed: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleGoogleSignInError = (error) => {
    console.error("Google sign-in error:", error);
    alert("Google sign-in failed. Please try again later.");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          {emailError && <span className="error">{emailError}</span>}
          <div className="password-input">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && <span className="error">{passwordError}</span>}
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Login"}
        </button>
        <GoogleOAuthProvider clientId="944161213551-ve6q3gohao3p9ju3ibofes7lef3ttfsj.apps.googleusercontent.com">
          {currState === "Login" && (
            <GoogleLogin
            clientId="944161213551-ve6q3gohao3p9ju3ibofes7lef3ttfsj.apps.googleusercontent.com" // Updated client ID         
              buttonText="Sign in with Google"
              onSuccess={handleGoogleSignIn}
              onError={handleGoogleSignInError}
              cookiePolicy={"single_host_origin"}
            />
          )}
        </GoogleOAuthProvider>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Sign up</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;