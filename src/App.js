// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AdminDashboard from './components/AdminDashboard';
import DoctorsPage from './components/DoctorsPage';
import LoginPage from './components/loginpage';
import ProtectedRoute from './components/ProtectedRoute';
import AddDoctorPage from './components/AddDoctorPage'; 
import ClinicPage from './components/ClinicPage'; 
import AddClinicPage from './components/AddClinicPage';
import ProceduresPage from './components/ProceduresPage';
import SpecializationsPage from './components/SpecializationsPage'; 

import DoctorDashboard from './doctor-components/DoctorDashboard';
import PatientsPage from './doctor-components/PatientsPage';
import CategoriesPage from './components/CategoriesPage'; 
import AddPatientPage from './doctor-components/AddPatientPage';
import PatientProfile from './doctor-components/PatientProfile'; 
import CreateVisit from './doctor-components/CreateVisit';
import AppointmentsPage from './doctor-components/AppointmentsPage'; 
import DoctorVisitsPage from './doctor-components/DoctorVisitsPage';
import VisitDetailsPage from "./doctor-components/VisitDetailsPage";
import ChatsPage from './doctor-components/ChatsPage';
import ScheduleSettingsPage from './doctor-components/ScheduleSettingsPage';
import BookAppointment from "./doctor-components/BookAppointment";
import DoctorProfile from './doctor-components/DoctorProfile';


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (

    <>

   <ToastContainer />

    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctors" element={
          <ProtectedRoute>
            <DoctorsPage />
          </ProtectedRoute>
        } />

        <Route path="/add-doctor" element={
          <ProtectedRoute>
            <AddDoctorPage />
          </ProtectedRoute>
        } /> 

        <Route path="/clinics" element={
          <ProtectedRoute>
            <ClinicPage />
          </ProtectedRoute>
        } />

        <Route path="/add-clinic" element={
          <ProtectedRoute>
            <AddClinicPage />
          </ProtectedRoute>
        } />

        <Route path="/patients" element={
           <ProtectedRoute>
             <PatientsPage />
           </ProtectedRoute>
        } />

        <Route path="/specializations" element={
            <ProtectedRoute>
              <SpecializationsPage />
            </ProtectedRoute>
        } />

        <Route path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
        }/>

        <Route path="/add-patient" element={
            <ProtectedRoute>
              <AddPatientPage />
            </ProtectedRoute>
        } />

        <Route path="/patient-profile/:patientId" element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
        }/>

        <Route path="/create-visit/:patientId" element={
              <ProtectedRoute>
                <CreateVisit />
              </ProtectedRoute>
        }/>

        <Route path="/appointments" element={
              <ProtectedRoute>
                 <AppointmentsPage />
              </ProtectedRoute>
        } />

        <Route path="/procedures" element={
              <ProtectedRoute>
                 <ProceduresPage  />
              </ProtectedRoute>
        } />


        <Route path="/doctor-visits" element={
              <ProtectedRoute>
                <DoctorVisitsPage />
              </ProtectedRoute>
        }/>


        <Route path="/bappointments" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
        }/>

        <Route path="/chat" element={
            <ProtectedRoute>
                <ChatsPage />
            </ProtectedRoute>
        } />

        <Route path="/doctor-profile" element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        } />

        
        <Route path="/patient-profile/:patientId" element={<PatientProfile />} />

        <Route path="/" element={<DoctorVisitsPage />} />

        <Route path="/visit/:visitID" element={<VisitDetailsPage />} />

        <Route path="/settings/schedule" element={
            <ProtectedRoute>
              <ScheduleSettingsPage />
            </ProtectedRoute>
        } />





      </Routes>
    </Router>

    </>

  );
}

export default App;
