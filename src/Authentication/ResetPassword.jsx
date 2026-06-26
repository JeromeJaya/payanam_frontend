import { useState, useEffect } from "react";
import { MobileLogin } from "./MobileLogin.jsx";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import {Link,Outlet} from "react-router-dom";
import {useNavigate, useLocation} from "react-router-dom";
import api from "../api/axios";
import PasswordInput from "./PasswordInput.jsx";
import { useAuth } from "../context/AuthContext";

export default function ResetLogin({ email = "email not fetched correctly" }) {
    const [show, setShow] = useState(false);
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOTP] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [resendCountdown, setResendCountdown] = useState(300);
    const { login } = useAuth();

    const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    const handleOTPChange = (event) => {
      const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 6);
      setOTP(digitsOnly);
    };

    const isOTPValid = otp.length === 6;

    useEffect(() => {
      setShow(true);
    }, []);

    useEffect(() => {
      if (resendCountdown <= 0) return;
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }, [resendCountdown]);

    if (showMobileLogin) return <MobileLogin />;

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      return `${mins}:${secs}`;
    };

    const isResendDisabled = resendCountdown > 0;

    async function handleSubmit(event) {
      event.preventDefault();
      if (!isOTPValid) {
        alert("Please enter a 6-digit OTP.");
        return;
      }
      if (newPassword !== confirmPass) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await api.post("/api/auth/reset-password", {
          email,
          otpCode: otp,
          newPassword,
        });
        if (response?.data?.success) {
          alert(response.data.message || "Password reset successful");
          navigate("/login");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Password Reset failed");
      }
    }

    async function handleResendOTP() {
      if (isResendDisabled) return;
      try {
        const res = await api.post("/api/auth/forgot-password", { email });
        if (res?.data?.success) {
          alert(res.data.message || "OTP resent");
          setResendCountdown(300);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to resend OTP");
      }
    }
  return (
    <>
    <Nav/>
    
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-end  px-12 py-12 pr-50 pt-10 ">
        <div
        className={` absolute inset-0 bg-cover bg-center mt-15  opacity-0
        transform transition-all duration-1000 ease-out
          ${show ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
  <div
        className={`
          max-w-md w-full
          transform transition-all duration-1000 ease-in
          ${show ? "translate-x-0 opacity-100" : "-translate-x-40 opacity-0"}
        `}
      >
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
          <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Enter the OTP with in 5 minutes</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <div className = "flex flex-row justify-around">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <button htmlFor="email" className="block  font-medium text-gray-700 dark:text-gray-300 mb-2"
            onClick ={ ()=> navigate("/forgotpassword")}>
             Change email
            </button>
          </div>
          <label htmlFor="email" className="block text-md font-medium text-gray-500 ml-5 dark:text-gray-300 mb-2">
            {location.state.email}
          </label>
          
        </div>

        <div className="flex items-center justify-between mb-2">
            <label htmlFor="OTP" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              Enter OTP 
            </label>
          </div>
          <input
            id="OTP"
            name="OTP"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="\d{6}"
            value={otp}
            onChange={handleOTPChange}
            required
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {!isOTPValid && otp.length > 0 && (
            <p className="text-red-500 text-sm mt-1">OTP must be exactly 6 digits.</p>
          )}
        <But3
          type="button"
          onClick={handleResendOTP}
          disabled={resendCountdown > 0}
          text={`Resend OTP${resendCountdown > 0 ? ` (${formatTime(resendCountdown)})` : ""}`}
          className={`w-fit block mx-auto py-3 px-4 rounded-lg font-medium justify-center transition-colors ${resendCountdown > 0 ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70 hover:bg-gray-400 dark:hover:bg-gray-600" : "bg-lime-100 dark:bg-lime-100 text-white dark:text-gray-900 hover:bg-lime-200 dark:hover:bg-lime-400"}`}
        />

        {/* ...new pass */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
          </div>
          <PasswordInput
            id="new-password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {newPassword && strongRe.test(newPassword) === false &&(
            <p className="text-red-500 text-sm mt-1">Password must be 8+ chars with upper, lower, digit, special</p>
          )}
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              Confirm new Password
            </label>
          </div>
          <PasswordInput
            id="ConfirmPassword"
            name="ConfirmPassword"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {confirmPass && newPassword !== confirmPass && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="flex justify-center w-full">
        <But3
          type="submit"
          text="Sign in"
          className="w-fit block mx-auto bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 dark:hover:bg-lime-400  justify-center transition-colors"
        />
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick = {()=>setShowMobileLogin(true)}
          >
            Login with mobile
            <Outlet/>
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <Link to="/EmailSignUp" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Sign up</Link>
        <Outlet/>
      </p>
    </div>
  </div>
</div>
</>
  );

}