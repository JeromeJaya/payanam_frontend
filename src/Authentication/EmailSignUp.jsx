import { useState, useEffect } from "react";
import { MobileLogin } from "./MobileLogin.jsx";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx"
import {But} from "../Buttons/But.jsx";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PasswordInput from "./PasswordInput.jsx";


export function EmailSignUp() {
    const [show, setShow] = useState(false);
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

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

     const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

     async function handleSubmit(event) {
    event.preventDefault();
    
    // Validate email before submission
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    // Front-end check for strength or mismatched password fields before hitting endpoint
    if (!strongRe.test(password) || password !== confirmPass) {
      return; 
    }

    setLoading(true);
    try {
      let response= await axios.post("http://localhost:3000/api/auth/register",{
        email, password,
      })
      
      if (response && response.data && response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
    <Nav/>
    
    {/* Responsiveness fixed here: Centered on mobile, right-aligned on large viewports */}
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-12 lg:pr-24 py-12 pt-20 relative overflow-hidden">
        <div
        className={` absolute inset-0 bg-cover bg-center mt-15  opacity-0
        transform transition-all duration-4000 ease-out
          ${show ? "opacity-50" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      
      <div
        className={`
          max-w-md w-full z-10
          transform transition-all duration-2000 ease-out
          ${show ? "translate-x-0 opacity-100" : "-translate-x-40 opacity-0"}
        `}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get Started with PAYANAM</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign up for an account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              {!emailError && email.length > 0 && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valid email address
                </p>
              )}
            </div>

            <div>
              <div className="mb-2">
                <label htmlFor="password" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {password && !strongRe.test(password) && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  Password must be 8+ chars with upper, lower, digit, and special characters.
                </p>
              )}
            </div>

            <div>
              <div className="mb-2">
                <label htmlFor="ConfirmPassword" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
              </div>
              <PasswordInput
                id="ConfirmPassword"
                name="ConfirmPassword"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {confirmPass && password !== confirmPass && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-center w-full pt-2">
            {loading ? (
              <div className="w-full sm:w-fit bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
                <span>Creating account...</span>
              </div>
            ) : (
              <But3
                type="submit"
                text ="Sign Up"
                className="w-full sm:w-fit block mx-auto bg-lime-600 dark:bg-lime-300 text-white 
                dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 
                dark:hover:bg-lime-400 justify-center transition-colors"
              />
            )}
            </div>
            
          </form>
              <button
                onClick = {()=>navigate("/vendoremailsignup")}
                className="w-full mt-4 sm:w-fit block mx-auto bg-emerald-400 dark:bg-lime-300 text-white 
                dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 
                dark:hover:bg-lime-400 justify-center transition-colors"
              >
                Switch to vendor SignUp
              </button>

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
            <span>Do you have an account?</span>
            <Link to="/Login" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
</>
  );
}