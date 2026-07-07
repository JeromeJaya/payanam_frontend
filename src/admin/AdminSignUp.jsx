import { useState, useEffect } from "react";
import { But3 } from "../Buttons/But3.jsx";
import bgImage from "../assets/bg3.png";
import Nav from "../NavComponent.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../Authentication/PasswordInput.jsx";

export default function AdminSignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

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

  // Password strength validation
  const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  
  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (!strongRe.test(pwd)) {
      return "Password must be 8+ chars with uppercase, lowercase, digit, and special character";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    if (value.length > 0) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length > 0) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError("");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      return;
    }

    if (password !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!adminSecretKey.trim()) {
      alert("Admin secret key is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/register-admin", {
        name: name.trim(),
        email,
        password,
        adminSecretKey,
      });

      if (response?.data?.success) {
        const userData = response.data.user;
        login(userData);
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center lg:justify-end px-4 sm:px-6 md:px-12 lg:pr-24 py-12 pt-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center mt-15 opacity-0
            transform transition-all duration-1000 ease-out
            ${show ? "opacity-50" : "opacity-0"}`}
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
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Registration</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Create an admin account for Payanam</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder=" Full Name"
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                    emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Email address"
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

              {/* Password Field */}
              <div>
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {passwordError && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  autoComplete="new-password"
                  required
                  placeholder=" Confirm Password"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {confirmPass && password !== confirmPass && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Admin Secret Key Field */}
              <div>
                <input
                  id="adminSecretKey"
                  name="adminSecretKey"
                  type="password"
                  required
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter admin secret key"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This key is required to create admin accounts. Contact the system administrator if you don't have it.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center w-full pt-2">
                {loading ? (
                  <div className="w-full sm:w-fit bg-indigo-600 dark:bg-indigo-300 text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </div>
                    <span>Creating admin account...</span>
                  </div>
                ) : (
                  <But3
                    type="submit"
                    text="Create Admin Account"
                    className="w-full sm:w-fit block mx-auto bg-indigo-600 dark:bg-indigo-300 text-white 
                    dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 
                    dark:hover:bg-indigo-400 justify-center transition-colors"
                  />
                )}
              </div>
            </form>

            {/* Link to Admin Login */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-1">
              <span>Already have an admin account?</span>
              <Link to="/admin/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign in
              </Link>
            </p>

            {/* Link to Regular Signup */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Not an admin?{" "}
                <Link to="/emailSignup" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500">
                  Sign up as a regular user
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
