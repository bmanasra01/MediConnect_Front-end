import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./AppointmentsPage.css";
import "./tables.css";
import "./ModalOverlay.css";
import "./search-bar.css"; // استيراد الستايل الموحد


const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const navigate = useNavigate();

  const fetchAppointments = async (query, date) => {
    setLoading(true);
    try {
      const response = await axios.get("/appointments/doctor/all", {
        params: { page: 1, size: 100, search: query, date: date },
      });
      setAppointments(response.data.content);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAppointments(searchQuery, selectedDate);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedDate]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  // Open confirmation modal
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      axios
        .put(
          `/appointments/cancel/doctor/${selectedAppointment.appointmentID}/${selectedAppointment.patient.patientId}`
        )
        .then(() => {
          setAppointments((prev) =>
            prev.map((appointment) =>
              appointment.appointmentID === selectedAppointment.appointmentID
                ? { ...appointment, isCancelled: true }
                : appointment
            )
          );
          setShowModal(false);
        })
        .catch((error) => console.error("Error canceling appointment:", error));
    }
  };

  return (
    <div className="appointments-page1">
      <DoctorSidebar/>

      <div className="appointments-content">
        <h2>Appointments</h2>
        <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by patient name or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="input"
        />
      </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="table-container">
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
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
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
                        {!appointment.isCancelled && !appointment.isDone && (
                          <button
                            className="cancel-button action-button"
                            onClick={() => openCancelModal(appointment)}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="view-button action-button"
                          onClick={() =>
                            navigate(
                              `/patient-profile/${appointment.patient.patientId}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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

export default AppointmentsPage;
