import { useState, useEffect } from "react";
import {But3} from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import {Link} from "react-router-dom";
import {useNavigate, useLocation} from "react-router-dom";
import api from "../api/axios";
import PasswordInput from "./PasswordInput.jsx";

export default function SetPassword() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const emaill = location.state?.email || "";
    const resetToken = location.state?.resetToken || "";

    useEffect(() => {
      if (!emaill || !resetToken) {
        navigate("/forgotpassword", { replace: true });
      }
    }, [emaill, resetToken, navigate]);

    const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    useEffect(() => {
      setShow(true);
    }, []);

    async function handleResetPassword(event) {
      event.preventDefault();
      setError("");

      if (!strongRe.test(newPassword)) {
        setError("Password must be 8+ chars with upper, lower, digit, special");
        return;
      }
      if (newPassword !== confirmPass) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      try {
        const response = await api.post("/api/auth/reset-password", {
          email: emaill,
          resetToken,
          newPassword,
          confirmNewPassword: confirmPass,
        });
        if (response?.data?.success) {
          alert(response.data.message || "Password reset successful");
          navigate("/login", { replace: true });
        } else {
          setError(response?.data?.message || "Password reset failed");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Password reset failed");
      } finally {
        setLoading(false);
      }
    }

  return (
    <>
    <Nav/>

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-3">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Enter your new password</p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleResetPassword}>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-row justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email address
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {emaill || "No email provided"}
              </p>
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
                onKeyDown={(e) => e.key === "Enter" && !loading && handleResetPassword(e)}
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
                onKeyDown={(e) => e.key === "Enter" && !loading && handleResetPassword(e)}
                autoComplete="new-password"
                required
                placeholder=""
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {confirmPass && newPassword !== confirmPass && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

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
                text="Reset Password"
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
