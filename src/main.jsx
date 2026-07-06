import { BrowserRouter } from 'react-router-dom'
import {HashRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import {EmailLogin} from "./Authentication/EmailLogin.jsx";
import Nav from "./NavComponent.jsx";
import {Banner} from "./cards/Banner.jsx";
import {Router} from "./Route.jsx"
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)