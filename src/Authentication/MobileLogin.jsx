import { useState, useEffect } from "react";
import { EmailLogin } from "./EmailLogin.jsx";
import {But2} from "../Buttons/But2.jsx";
import bgImage from "../assets/bg3.png";

import Nav from "../NavComponent.jsx"
import {Link} from "react-router-dom"

export function MobileLogin() {
    const [show, setShow] = useState(false);
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (showEmailLogin) return <EmailLogin />;

  // Indian phone number validation (10 digits starting with 6-9)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      return "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      return "Please enter a valid 10-digit Indian mobile number (starting with 6-9)";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numericValue);
    
    // Validate on change
    if (numericValue.length === 10) {
      const error = validatePhoneNumber(numericValue);
      setPhoneError(error);
    } else if (numericValue.length > 0) {
      setPhoneError(`Please enter ${10 - numericValue.length} more digit(s)`);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }
    
    setLoading(true);
    try {
      // Proceed with OTP request
      alert(`OTP sent to ${phoneNumber}`);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Nav/>
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-end  px-12 py-12 pr-50 pt-10 ">
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
          max-w-md w-full
          transform transition-all duration-2000 ease-out
          ${show ? "translate-x-0 opacity-100" : "-translate-x-40 opacity-0"}
        `}
      >
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
          <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="MobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mobile Number
          </label>
          <input
            id="MobileNumber"
            name="MobileNumber"
            type="tel"
            required
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
            className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
              phoneError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Enter 10-digit mobile number"
          />
          {phoneError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {phoneError}
            </p>
          )}
          {!phoneError && phoneNumber.length === 10 && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid mobile number
            </p>
          )}
        </div>


        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-lime-600 dark:text-lime-400 focus:ring-lime-500 dark:focus:ring-lime-400 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>

        {loading ? (
          <div className="w-full bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            </div>
            <span>Sending OTP...</span>
          </div>
        ) : (
          <But2
            type="submit"
            text ="Get OTP to this number"
            className="w-full bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 dark:hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 dark:focus:ring-offset-gray-800 transition-colors"
          />
        )}
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick = {()=>setShowEmailLogin(true)}
          >
            Login with Email
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <Link to="/EmailSignUp" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Sign up</Link>
      </p>
    </div>
  </div>
</div>
</>
  );
}
