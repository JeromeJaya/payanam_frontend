import { useState, useEffect } from "react";
import {But3} from "../../Buttons/But3.jsx";
import bgImage from "../../assets/bg3.png";
import Nav from "../../NavComponent.jsx"
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PasswordInput from "../PasswordInput.jsx";


export default function VendorEmailSignUp() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("") 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const navigate = useNavigate()

  useEffect(() => {
    setShow(true);
  }, []);

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phone) {
      return "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      return "Enter a valid mobile number (e.g. +919876543210)";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNo(value);
    if (value.length > 0) {
      setPhoneError(validatePhone(value));
    } else {
      setPhoneError("");
    }
  };

     const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    async function handleSubmit(event) {
    event.preventDefault();
    
    const phoneErr = validatePhone(phoneNo);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    try{
      let response= await axios.post("http://localhost:3000/api/auth/register-vendor",{
      "name": name,
      "email": email,
      "password": password,
      "phoneNo": phoneNo,
      "companyName": companyName,
      "gstNumber": gstNumber
    })
    alert(response.data.message)
    if (response && response.data && response.data.success) navigate("/Login");
  }
    catch(err) {
      alert(err.response.data.message)
    }
  }
  return (
    <>
    <Nav/>
    
<div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-end  px-12 py-12 pr-50 mt-20">
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
          max-w-150 w-full
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Sign Up</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">SignUp with an Vendor account </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className = "flex flex-row gap-5 justify-around">
          <input
            id="name"
            name="name"
            type="name"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your Name"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
        </div>
        <div className = "flex flex-row gap-5 justify-around">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter Your Email address"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
        </div>

        <div className = "flex flex-row gap-5 justify-around">
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            autoComplete="current-password"
            required
            placeholder="Enter a Strong Password"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {password && strongRe.test(password) === false &&(
            <p className="text-red-500 text-sm mt-1">Password must be 8+ chars with upper, lower, digit, special</p>
          )}
          <PasswordInput
            id="ConfirmPassword"
            name="ConfirmPassword"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            autoComplete="current-password"
            required
            placeholder="Confirm the Password Again"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {confirmPass && password !== confirmPass && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <div>
          <input
            id="phone"
            name="phone"
            value={phoneNo}
            onChange={handlePhoneChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            required
            placeholder="Enter your Phone Number"
            className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
              phoneError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          />
          {phoneError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {phoneError}
            </p>
          )}
        </div>

        <div className = "flex flex-row gap-5 justify-around">
          <input
            id="CompanyName"
            name="CompanyName"
            required
            placeholder="Enter your  Company Name"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <input
            id="GST"
            name="GST"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            required
            placeholder="Enter your GST Number"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex justify-center w-full">
        <But3
          type="submit"
          text ="Sign Up"
          className="w-fit block mx-auto bg-lime-600 dark:bg-lime-300 text-white 
          dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-lime-700 
          dark:hover:bg-lime-400  justify-center transition-colors"
        />
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Do you have an account?
        <Link to="/VendoremailLogin" className="font-medium text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300">
          Sign in </Link>
      </p>
    </div>
  </div>
</div>
</>
  );

}