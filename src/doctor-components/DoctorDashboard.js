import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./DoctorDashboard.css";
import "./tables.css";
import "./ModalOverlay.css";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faUsers, faClock } from "@fortawesome/free-solid-svg-icons";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);

  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {

    axios
    .get("/doctors/auth/me")
    .then((response) => {
      setDoctorName(`${response.data.user.firstName} ${response.data.user.lastName}`);
    })
    .catch((error) => {
      console.error("Error fetching doctor details:", error);
    });

    // Fetch today's appointments
    axios
      .get("/appointments/doctor/today?page=1&size=100")
      .then((response) => {
        setAppointments(response.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });

      // Fetch total patients
    axios
    .get("/doctors/patients?page=1&size=1000")
    .then((response) => {
      setTotalPatients(response.data.totalElements); // Total count from API
    })
    .catch((error) => {
      console.error("Error fetching total patients:", error);
    })
    .finally(() => setLoading(false));



  }, []);

  const upcomingSchedules = appointments.filter(app => !app.isDone && !app.isCancelled).length;


  // Open confirmation modal
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Cancel appointment handler
  const handleCancel = () => {
    if (selectedAppointment) {
      axios
        .put(
          `/appointments/cancel/doctor/${selectedAppointment.appointmentID}/${selectedAppointment.patient.patientId}`
        )
        .then(() => {
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.appointmentID === selectedAppointment.appointmentID
                ? { ...appointment, isCancelled: true }
                : appointment
            )
          );
          setShowModal(false); // Close modal after cancel
          setSelectedAppointment(null);
        })
        .catch((error) => {
          console.error("Error canceling appointment:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-dashboard">
      <Sidebar />

      <div className="dashboard-content">
      <div className="welcome-container">
        <h1 className="welcome-text">
          Welcome, <span className="doctor-name">Dr. {doctorName}</span> 
        </h1>
      </div>

        {/* Widgets Section */}
        <div className="dashboard-widgets">
        <div className="widget">
            <FontAwesomeIcon icon={faCalendarCheck} className="widget-icon appointments-icon" />
            <h3>Today's Appointments</h3>
            <p>{appointments.length} Appointments</p>
          </div>
          {/* Total Patients */}
          <div className="widget">
            <FontAwesomeIcon icon={faUsers} className="widget-icon patients-icon" />
            <h3>Total Patients</h3>
            <p>{totalPatients} Total</p>
          </div>
           {/* Upcoming Schedules */}
           <div className="widget">
            <FontAwesomeIcon icon={faClock} className="widget-icon schedules-icon" />
            <h3>Upcoming Schedules</h3>
            <p>{upcomingSchedules} Scheduled</p>
          </div>
        </div>


        {/* Appointments Table */}
        <div className="table-container">
          <h2>Today's Appointments</h2>
          <table className="common-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Phone Number</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentID}>
                  <td>{appointment.appointmentID}</td>
                  <td>
                    {appointment.patient.user.firstName}{" "}
                    {appointment.patient.user.lastName}
                  </td>
                  <td>{appointment.patient.patientId}</td>
                  <td>{appointment.patient.user.phone}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    {appointment.isCancelled ? (
                      <span className="state-label CANCELED">Canceled</span>
                    ) : appointment.isDone ? (
                      <span className="state-label DONE">Done</span>
                    ) : (
                      <span className="state-label PENDING">Pending</span>
                    )}
                  </td>
                  <td>
                    {/* Show Cancel button only for pending appointments */}
                    {!appointment.isDone && !appointment.isCancelled && (
                      <button
                        className="cancel-button action-button"
                        onClick={() => openCancelModal(appointment)}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Disable View button if appointment is done or cancelled */}
                    <button
                      className="view-button action-button"
                      onClick={() =>
                        navigate(`/create-visit/${appointment.patient.patientId}`, {
                          state: { appointmentID: appointment.appointmentID },
                        })
                      }
                      disabled={appointment.isDone || appointment.isCancelled} // ✅ Disable button
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Cancellation</h2>
            <p>
              Are you sure you want to cancel this appointment for{" "}
              <strong>
                {selectedAppointment.patient.user.firstName}{" "}
                {selectedAppointment.patient.user.lastName}
              </strong>{" "}
              (ID: {selectedAppointment.patient.patientId})?
            </p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleCancel}>
                Yes, Cancel
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
