import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage  from "./pages/Register/RegisterPage";
import Dashboard from "./pages/admin/Dashboard";
import Offers from "./pages/admin/Offers";
import UsersPage from "./pages/admin/UsersPage";
import StudentsPage from "./pages/admin/StudentsPage";
import CompaniesPage from "./pages/admin/CompaniesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import StudentApplications from "./pages/student/Applications";
import StudentOffers from "./pages/student/Offers";
import StudentProfile from "./pages/student/Profile";
import StudentDashboard from "./pages/student/Dashboard";
import ApplyForm from "./pages/student/ApplyForm";
import CompanyDashboard from "./pages/company/Dashboard";
import Profile from "./pages/company/Profile";
import CompanyOffers from "./pages/company/offres";
import Applications  from "./pages/company/Applications";
import ResetPassword from "./pages/resetPassword";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirection vers le dashboard par défaut */}
        <Route path="/" element={<Navigate to="/login" />} />
      

        {/* Routes pour l'admin */}
     
       <Route path="/login" element={<LoginPage />} />
 

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/settings" element={<SettingsPage />} /> 

         {/* Routes pour l'etudiant */}
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/offers" element={<StudentOffers />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/offers/:id/apply" element={<ApplyForm />} />

         {/* Routes pour Company */}
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/profile" element={<Profile />} />
        <Route path="/company/offers" element={< CompanyOffers />} />
        <Route path="/company/applications" element={< Applications />} />
      


         <Route path="/reset-password/:token" element={<ResetPassword />} />


      </Routes>
    </Router>
  );
};

export default App;
