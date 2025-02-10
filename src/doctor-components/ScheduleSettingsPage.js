
import React, { useState, useEffect } from "react";
import axios from "./axiosConfig"; // Axios configuration with token
import DoctorSidebar from "./DoctorSidebar";
import "./ScheduleSettingsPage.css";

const ScheduleSettingsPage = () => {
  const [formData, setFormData] = useState({
    daysOfWeek: [],
    startTime: "",
    endTime: "",
    fromDate: "",
    toDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState([]); // State to store all schedules
  const [loadingSchedules, setLoadingSchedules] = useState(false); // State for loading indicator

  const toggleDay = (day) => {
    setFormData((prevData) => ({
      ...prevData,
      daysOfWeek: prevData.daysOfWeek.includes(day)
        ? prevData.daysOfWeek.filter((d) => d !== day)
        : [...prevData.daysOfWeek, day],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSchedule = async () => {
    const { daysOfWeek, startTime, endTime, fromDate, toDate } = formData;
  
    const scheduleData = {
      schedule: {
        startTime,
        endTime,
        fromDate,
        toDate,
      },
      daysOfWeek,
    };
  
    try {
      const response = await axios.post("/doctors/schedule", scheduleData);
      console.log("Schedule saved successfully:", response.data);
      alert("Schedule saved successfully!");
      fetchSchedules(); // Refresh schedules after saving
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule. Please try again.");
    }
  
    setShowModal(false);
  };
  

  const handleCancel = () => {
    setFormData({
      daysOfWeek: [],
      startTime: "",
      endTime: "",
      fromDate: "",
      toDate: "",
    });
    setShowModal(false);
  };

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const response = await axios.get("/doctors/schedule/all");
      setSchedules(response.data.map(schedule => ({
        scheduleId: schedule.scheduleId,
        daysOfWeek: schedule.daysOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        fromDate: schedule.fromDate,
        toDate: schedule.toDate,
        doctor: {
          doctorId: schedule.doctor.doctorId,
          name: `${schedule.doctor.user.firstName} ${schedule.doctor.user.lastName}`,
          specialization: schedule.doctor.specialization.special_name,
        }
      })));
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="schedule-settings-page">
      <DoctorSidebar />
      <div className="content">
        <h2>Schedule Settings</h2>
        <form
          className="schedule-form"
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <div className="form-row">
            <div>
              <label>Days of the Week</label>
              <div className="days-buttons">
                {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(
                  (day) => (
                    <button
                      type="button"
                      key={day}
                      className={`day-button ${
                        formData.daysOfWeek.includes(day) ? "selected" : ""
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>

        {/* Modal */}
        {showModal && (
          <div id="unique-modal" className="unique-modal">
            <div className="unique-modal-content">
              <h3>Confirm Schedule Settings</h3>
              <div className="unique-confirmation-form">
                <div className="confirmation-row">
                  <div className="confirmation-item">
                    <label className="unique-confirmation-label">Days of the Week:</label>
                    <span className="unique-confirmation-value">
                      {formData.daysOfWeek.join(", ") || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="confirmation-row">
                  <div className="confirmation-item">
                    <label className="unique-confirmation-label">Start Time:</label>
                    <span className="unique-confirmation-value">{formData.startTime || "N/A"}</span>
                  </div>
                  <div className="confirmation-item">
                    <label className="unique-confirmation-label">End Time:</label>
                    <span className="unique-confirmation-value">{formData.endTime || "N/A"}</span>
                  </div>
                </div>
                <div className="confirmation-row">
                  <div className="confirmation-item">
                    <label className="unique-confirmation-label">From Date:</label>
                    <span className="unique-confirmation-value">{formData.fromDate || "N/A"}</span>
                  </div>
                  <div className="confirmation-item">
                    <label className="unique-confirmation-label">To Date:</label>
                    <span className="unique-confirmation-value">{formData.toDate || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="unique-modal-actions">
                <button onClick={handleCancel} className="unique-cancel-button">
                  Cancel
                </button>
                <button onClick={handleSaveSchedule} className="unique-confirm-button">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display All Schedules */}
        <div className="all-schedules">
          <h2>All Schedules</h2>
          {loadingSchedules ? (
            <p>Loading schedules...</p>
          ) : schedules.length > 0 ? (
            <ul className="schedule-list">
            {schedules.map((schedule) => (
              <li key={schedule.scheduleId} className="schedule-card">
                <p><strong>Doctor:</strong> {schedule.doctor.name} ({schedule.doctor.specialization})</p>
                <p><strong>Days:</strong> {schedule.daysOfWeek.join(", ")}</p>
                <p><strong>Start Time:</strong> {schedule.startTime}</p>
                <p><strong>End Time:</strong> {schedule.endTime}</p>
                <p><strong>From:</strong> {schedule.fromDate}</p>
                <p><strong>To:</strong> {schedule.toDate}</p>
              </li>
            ))}
          </ul>
          

          ) : (
            <p>No schedules found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettingsPage;

