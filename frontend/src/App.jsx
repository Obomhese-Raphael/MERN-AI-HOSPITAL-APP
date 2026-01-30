import React from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import History from "./pages/History";
import Newsletter from "./components/NewsLetter";
import Footer from "./components/Footer";
import { useUser, SignIn } from "@clerk/clerk-react";
import Services from "./pages/Services";
import Loader from "./components/Loading";
import HospitalCall from "./pages/HospitalCall";
import MedicalFeedback from "./components/MedicalFeedback";
// import SummaryPage from "./pages/SummaryPage";
import CallSummary from "./pages/SummaryPage";

const App = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Loader/>;
  }

  return (
    <div>
      <ToastContainer />
      {user && <Navbar />}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] mb-30">
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/sign-in" />}
          />
          <Route path="/history" element={user ? <History /> : <Navigate to="/sign-in" />} />
          <Route path="/contact" element={user ? <Contact /> : <Navigate to="/sign-in" />} />
          <Route path="/services" element={user ? <Services /> : <Navigate to="/sign-in" />} />
          <Route
            path="/hospital-call/:callId"
            element={user ? <HospitalCall /> : <Navigate to="/sign-in" />}
          />
          <Route path="/feedback/:callId" element={<MedicalFeedback />} />
          <Route path="/hospital-call/:id/summary" element={<CallSummary />} />
          <Route
            path="/sign-in/*"
            element={
              <div className="flex justify-center items-center h-screen">
                <div className="p-8 rounded w-full max-w-md">
                  <SignIn path="/sign-in" routing="path" />
                </div>
              </div>
            }
          />
          {user && <Route path="/newsletter" element={<Newsletter />} />}
        </Routes>
        {user && <Newsletter />}
      </div>
      {user && <Footer />}
    </div>
  );
};

export default App;