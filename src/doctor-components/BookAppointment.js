
import React, { useState, useEffect } from "react";
import axios from "./axiosConfig"; 
import DoctorSidebar from "./DoctorSidebar";
import "./BookAppointment.css";
import "./tables.css";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa"; 


const BookAppointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState(""); // For selecting a date beyond the first 7 days

  // Generate the first 7 days
  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dateList = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateList.push(date);
      }
      setDates(dateList);
      setSelectedDate(dateList[0].toISOString().split("T")[0]); // Set current date as selected
    };
    generateDates();
  }, []);

  // Fetch appointments for the selected date
  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  // Fetch appointments
  const fetchAppointments = async (date) => {
    try {
      const response = await axios.get(`/appointments/slots`, {
        params: { doctorID: "", date },
      });

      if (typeof response.data === "string") {
        toast.info(response.data); // Show the message from the backend
        setAppointments([]); // Clear appointments if no slots are available
      } else {
        setAppointments(response.data);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data;

        if (status === 400) {
          toast.error(`Bad Request: ${message}`);
        } else if (status === 403) {
          toast.warning("Unauthorized: You don't have permission to view these slots.");
        } else if (status === 500) {
          toast.error(`Server Error: ${message}`);
        } else {
          toast.error(`Error: ${message}`);
        }
      } else {
        console.error("Error fetching appointments:", err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/doctors/patients", {
        params: {
          page: 1,
          size: 10,
          search: searchTerm,
        },
      });
      setPatients(response.data.content);
    } catch (err) {
      console.error("Error fetching patients:", err);
      toast.error("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Book appointment
  const handleBookAppointment = async (appointmentTime) => {
    if (!selectedPatient) {
      toast.warning("Please select a patient first.");
      return;
    }
    try {
      const payload = {
        appointmentDate: selectedDate,
        appointmentTime,
        patientID: selectedPatient.patientId,
      };
      await axios.post("/appointments/appointment/doctor", payload);
      toast.success("Appointment booked successfully!");
      fetchAppointments(selectedDate); // Refresh appointments after booking
    } catch (err) {
      console.error("Error booking appointment:", err);
      toast.error("Failed to book the appointment. Please try again.");
    }
  };

  return (
    <div className="book-appointment-page">
      <DoctorSidebar />
      <div className="content">
        <h2>Book Appointment</h2>

        <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search patient by ID, phone, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={fetchPatients}
          className="input"
        />
      </div>

      {patients.length > 0 && (
        <ul className="patient-list">
          {patients.map((patient) => (
            <li
              key={patient.patientId}
              className={`patient-item ${selectedPatient?.patientId === patient.patientId ? "selected" : ""}`}
              onClick={() => {
                setSelectedPatient(patient);
                setPatients([]); // إخفاء القائمة بعد الاختيار
              }}
            >
              {patient.user.firstName} {patient.user.lastName} - {patient.patientId}
            </li>
          ))}
        </ul>
      )}


        {selectedPatient && (
           <div className="patient-info-container">
           <FaUserCircle className="patient-photo-icon-lg" />
           <div className="patient-info-content">
             <h2>{selectedPatient.user.firstName} {selectedPatient.user.lastName}</h2>
             <div className="patient-info-grid-unique">
               <p><strong>Patient ID:</strong> {selectedPatient.patientId}</p>
               <p><strong>Email:</strong> {selectedPatient.user.email}</p>
               <p><strong>Phone:</strong> {selectedPatient.user.phone}</p>
               <p><strong>Gender:</strong> {selectedPatient.gender}</p>
               <p><strong>Blood Type:</strong> {selectedPatient.bloodType}</p>
               <p><strong>Height:</strong> {selectedPatient.height} cm</p>
               <p><strong>Weight:</strong> {selectedPatient.weight} kg</p>
             </div>
           </div>
         </div>
        )}

        {/* Date Selection */}
        <div className="date-selection">
          
          <div className="dates-container">
            {dates.map((date) => (
              <button
                key={date}
                className={`date-button ${
                  selectedDate === date.toISOString().split("T")[0] ? "selected" : ""
                }`}
                onClick={() => setSelectedDate(date.toISOString().split("T")[0])}
              >
                {date.toDateString().split(" ")[0]} {date.getDate()}
              </button>
            ))}
          </div>
          <div className="custom-date">
            <label>Select Another Date:</label>
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>


        {/* Appointment Table */}
        <div className="table-container">
          <h3>Appointments</h3>
          <table className="common-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((slot, index) => {
                const [time, status] = slot.split(" (");
                const isReserved = status?.trim() === "Reserved)";
                return (
                  <tr key={index}>
                    <td>{time}</td>
                    <td>{status?.replace(")", "")}</td>
                    <td>
                      <button
                        className={`book-button action-button ${
                          isReserved ? "reserved" : ""
                        }`}
                        disabled={isReserved || !selectedPatient}
                        onClick={() => handleBookAppointment(time)}
                      >
                        {isReserved ? "Reserved" : "Book"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

