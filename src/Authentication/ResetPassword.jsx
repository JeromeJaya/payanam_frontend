import { useState, useEffect } from "react";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import {Link} from "react-router-dom";
import {useNavigate, useLocation} from "react-router-dom";
import api from "../api/axios";
import PasswordInput from "./PasswordInput.jsx";

export default function ResetLogin() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOTP] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [resendCountdown, setResendCountdown] = useState(300);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const emaill = location.state?.email || "";
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

      setLoading(true);
      try {
        const response = await api.post("/api/auth/reset-password", {
          "email": emaill,
          "otpCode": otp,
          "newPassword": newPassword,
        });
        if (response?.data?.success) {
          alert(response.data.message || "Password reset successful");
          navigate("/login", { replace: true });
        } else {
          alert(response?.data?.message || "Password Reset failed");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Password Reset failed");
      } finally {
        setLoading(false);
      }
    }

    async function handleResendOTP() {
      if (isResendDisabled) return;
      setResendLoading(true);
      try {
        const res = await api.post("/api/auth/forgot-password", { email: emaill });
        if (res?.data?.success) {
          alert(res.data.message || "OTP resent");
          setResendCountdown(300);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to resend OTP");
      } finally {
        setResendLoading(false);
      }
    }
  return (
    <>
    <Nav/>
    
    {/* Responsiveness fixed here: dynamic margins/padding, flex alignment shifts gracefully */}
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-12 lg:pr-24 py-12 pt-20 relative overflow-hidden">
        <div
        className={`  absolute inset-0 bg-cover bg-center mt-15  opacity-0
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-3">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Enter the OTP within 5 minutes</p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className = "flex flex-row justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email address
                </span>
                <button type="button" className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline"
                onClick ={ ()=> navigate("/forgotpassword")}>
                 Change
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {emaill || "No email provided"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="OTP" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
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
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                required
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {!isOTPValid && otp.length > 0 && (
                <p className="text-red-500 text-xs mt-1">OTP must be exactly 6 digits.</p>
              )}
            </div>

            <div className="w-full">
            {resendLoading ? (
              <div className="w-full sm:w-fit block mx-auto bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 rounded-full border-2 border-lime-600 border-t-transparent animate-spin"></div>
                </div>
                <span className="text-sm">Sending...</span>
              </div>
            ) : (
              <But3
                type="button"
                onClick={handleResendOTP}
                disabled={resendCountdown > 0}
                text={`Resend OTP${resendCountdown > 0 ? ` (${formatTime(resendCountdown)})` : ""}`}
                className={`w-full sm:w-fit block mx-auto py-2.5 px-4 rounded-lg font-medium text-sm justify-center transition-colors ${resendCountdown > 0 ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70" : "bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-900/60"}`}
              />
            )}
            </div>

            <div>
              <div className="mb-1.5">
                <label htmlFor="new-password" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
              </div>
              <PasswordInput
                id="new-password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {newPassword && !strongRe.test(newPassword) && (
                <p className="text-red-500 text-xs mt-1">Password must be 8+ chars with upper, lower, digit, special</p>
              )}
            </div>

            <div>
              <div className="mb-1.5">
                <label htmlFor="ConfirmPassword" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
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
              {confirmPass && newPassword !== confirmPass && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-center w-full pt-2">
            {loading ? (
              <div className="w-full sm:w-fit bg-lime-600 dark:bg-lime-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
                <span>Resetting password...</span>
              </div>
            ) : (
              <But3
                type="submit"
                text="Sign in"
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

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-1">
            <span>Don't have an account?</span>
            <Link to="/EmailSignUp" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
</>
  );
}