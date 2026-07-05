import { useState, useEffect } from "react";
import { MobileLogin } from "./MobileLogin.jsx";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import {Link,Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import api from "../api/axios.js"

export default function ForgotPassword() {
    const [show, setShow] = useState(false);
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("request"); // 'request' or 'verify'

  useEffect(() => {
    setShow(true);
  }, []);
  if (showMobileLogin) return <MobileLogin />; 

  async function handleSendOTP(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      if (res?.data?.success) {
        alert(res.data.message || "OTP sent");
        navigate("/resetpassword", {state:{email}})
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Nav/>
    
    {/* FIXED RESPONSIVENESS: Centered on mobile/tablets, right-aligned (lg:justify-end) on desktop screens */}
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
        {/* Adjusted interior padding for ultra-small screens */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Password Recovery</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Recover your account with an OTP</p>
          </div>

          <form className="space-y-6" onSubmit={handleSendOTP}>
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none
                 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSendOTP(e)}
              />
            </div>
            <div className="flex justify-center w-full">
            {loading ? (
              <div className="w-full sm:w-fit bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              <But3
                type="submit"
                text="Send OTP"
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