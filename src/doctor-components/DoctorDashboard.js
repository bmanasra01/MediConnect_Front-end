import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
        <h1>Welcome, Doctor</h1>


        {/* Widgets Section */}
        <div className="dashboard-widgets">
          <div className="widget">
            <h3>Today's Appointments</h3>
            <p>{appointments.length} Appointments</p>
          </div>
          <div className="widget">
            <h3>Total Patients</h3>
            <p>150 Total</p> {/* Update dynamically if required */}
          </div>
          <div className="widget">
            <h3>Upcoming Schedules</h3>
            <p>3 Scheduled</p> {/* Update dynamically if required */}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="appointment-table">
          <h2>Today's Appointments</h2>
          <table>
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
                        className="cancel-button"
                        onClick={() => openCancelModal(appointment)}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Always show the View button */}
                    <button
                      className="view-button"
                      onClick={() =>
                        navigate(`/patient-profile/${appointment.patient.patientId}`)
                      }
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
