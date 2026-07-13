import { useState } from "react";
import { But3 } from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../Authentication/PasswordInput.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
    const value = e.target.value.toLowerCase();
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
        const userData = response.data.user;
        // Check if user is admin
        if (userData.role !== "admin") {
          // Redirect non-admin users to their appropriate login page
          if (userData.role === "vendor") {
            navigate("/login", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
          return;
        }
        login(userData);
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />

      {/* Responsiveness fixed here: centered by default, right-aligned on large screens, safe padding throughout */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-12 lg:pr-24 py-12 pt-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center mt-15 opacity-50
          transform transition-all duration-1000 ease-out`}
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        ></div>

        <div
          className={`
            max-w-md w-full z-10
            transform transition-all duration-1000 ease-in
            translate-x-0 opacity-100
          `}
        >
          {/* Adjusted inner padding slightly for micro-screens (p-6 to p-8) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your admin account</p>
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
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="admin@example.com"
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
                <label htmlFor="password" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex justify-center w-full">
                {loading ? (
                  <div className="w-full sm:w-fit bg-indigo-600 dark:bg-indigo-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <But3
                    type="submit"
                    text="Sign in"
                    className="w-full sm:w-fit block mx-auto bg-indigo-600 dark:bg-indigo-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 justify-center transition-colors"
                  />
                )}
              </div>
            </form>

            {/* Link to Admin Signup */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-1">
              <span>Need an admin account?</span>
              <Link to="/admin/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}