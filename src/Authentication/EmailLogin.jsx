import { useState, useEffect } from "react";
// import { MobileLogin } from "./MobileLogin.jsx";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";

import {Link,Outlet, useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "./PasswordInput.jsx";

export function EmailLogin() {
    const [show, setShow] = useState(false);
    const [showMobileLogin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const from = location.state?.from || "/MainPage";
    const bookingData = location.state?.bookingData;

  useEffect(() => {
    setShow(true);
  }, []);
  if (showMobileLogin) return <MobileLogin />; 

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert to lowercase
    setEmail(value);
    
    // Validate on change
    if (value.length > 0) {
      const error = validateEmail(value);
      setEmailError(error);
    } else {
      setEmailError("");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    // Validate email before submission
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response?.data?.success) {
        login(response.data.user);
        if (response.data.user.role === "vendor") {
          navigate("/vendordashboard", { replace: true });
        } else if (bookingData) {
          navigate("/seatconfirmation", { 
            state: bookingData,
            replace: true
          });
        } else if (from !== "/MainPage") {
          navigate(from, { replace: true });
        } else {
          navigate("/MainPage");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
    <Nav/>
    
    {/* Responsiveness fixed here: centered by default, right-aligned on large screens, safe padding throughout */}
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-12 lg:pr-24 py-12 pt-20 relative overflow-hidden">
        <div
        className={`absolute inset-0 bg-cover bg-center mt-15 opacity-0
        transform transition-all duration-1000 ease-out
          ${show ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      
      <div
        className={`
          max-w-md w-full z-10
          transform transition-all duration-1000 ease-in
          ${show ? "translate-x-0 opacity-100" : "-translate-x-40 opacity-0"}
        `}
      >
        {/* Adjusted inner padding slightly for micro-screens (p-6 to p-8) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                  emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="example@gmail.com"
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </p>
              )}

            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className = "flex flex-rows gap-1">
                  <Link to="/forgotpassword" className="text-xs sm:text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Forgot password?</Link>
                </div>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex justify-center w-full">
            {loading ? (
              <div className="w-full sm:w-fit bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
                <span>Signing in...</span>
              </div>
            ) : (
              <But3
                type = "submit"
                text ="Sign in"
                className="w-full sm:w-fit block mx-auto bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 dark:hover:bg-lime-400 justify-center transition-colors"
              />
            )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-1">
            <span>Don't have an account?</span>
            <Link to="/EmailSignUp" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Sign up</Link>
            <Outlet/>
          </p>
        </div>
      </div>
    </div>
  </>
  );
}