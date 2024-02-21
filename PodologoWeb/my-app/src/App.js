import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// Ensure the import path is correct and the file name matches the component name
import FeaturedService from "./pages/FeaturedService"; 
import FeaturedServicesPage from "./pages/FeaturedServicePage"; // Corrected import assuming you have a separate page for listing services
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <div className="bg-slate-400/75 w-full">
        <Navbar />
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/featured-services" element={<FeaturedServicesPage/>} />
          <Route path="/featured-service/:id" element={<FeaturedService/>}/> {/* Corrected path */}
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
        </Routes>
    </div>
  );
}

export default App;
