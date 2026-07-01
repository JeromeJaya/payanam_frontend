import { useState, useEffect } from "react";
// import { MobileLogin } from "../MobileLogin.jsx";
import {But3} from "../../Buttons/But3.jsx";
import bgImage from "../../assets/bg3.png";
import Nav from "../../NavComponent.jsx";
import {But} from "../../Buttons/But.jsx";
import {Link,Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PasswordInput from "../PasswordInput.jsx";

export default function VendorEmailLogin() {
    const [show, setShow] = useState(false);
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();


  useEffect(() => {
    setShow(true);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response?.data?.success) {
        login(response.data.user);
        navigate("/vendordashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome vendor </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your vendor account</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className = "flex flex-rows gap-1">
              <Link to="/forgotpassword" className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Forgot password?</Link>
            </div>
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div className="flex justify-center w-full">
        <But3
          type = " Submit"
          text ="Sign in"
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

        {/* <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick = {()=>setShowMobileLogin(true)}
          >
            Login with mobile
            <Outlet/>
          </button>
        </div> */}
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <Link to="/VendorEmailSignUp" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">Sign up</Link>
        <Outlet/>
      </p>
    </div>
  </div>
</div>
</>
  );

}