/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const DoctorModal = ({ doctorName = "Доктор", date = "2025-06-12", onClose }) => {
  const [timeSlots] = useState([
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ]);
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  // Найти, занято ли время, и кем
  const findAppointmentByTime = (time) => {
    return appointments.find(
      (a) => a.date === date && a.time === time
    );
  };

  const handleTimeClick = (time) => {
    const appointment = findAppointmentByTime(time);
    if (appointment) {
      alert(`Время занято пациентом: ${appointment.patientName}`);
    } else {
      setSelectedTime(time);
    }
  };

  const handleBook = () => {
    if (!patientName || !selectedTime) {
      alert("Введите имя пациента и выберите время");
      return;
    }
    const appointment = findAppointmentByTime(selectedTime);
    if (appointment) {
      alert(`Выбранное время уже занято пациентом: ${appointment.patientName}`);
      return;
    }
    const newAppointment = {
      doctorName,
      date,
      time: selectedTime,
      patientName,
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    alert(`Запись подтверждена на ${selectedTime} для ${patientName}`);
    onClose();
  };

  return (
    <>
      {/* Оверлей */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />
      {/* Модальное окно */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          zIndex: 1000,
          width: 320,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          userSelect: "none",
        }}
      >
        <h3>
          Записаться к {doctorName} <br />
          на {date}
        </h3>
        <input
          placeholder="Ваше имя"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={{ width: "100%", padding: 6, marginBottom: 10 }}
        />
        <div style={{ marginBottom: 10 }}>
          {timeSlots.map((time) => {
            const appointment = findAppointmentByTime(time);
            const taken = Boolean(appointment);
            return (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                style={{
                  marginRight: 6,
                  marginBottom: 6,
                  padding: "6px 12px",
                  backgroundColor: selectedTime === time ? "#4caf50" : "#eee",
                  color: selectedTime === time ? "white" : "black",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: 4,
                  opacity: taken ? 0.6 : 1,
                }}
              >
                {time} {taken ? ` (занято)` : ""}
              </button>
            );
          })}
        </div>
        <button onClick={handleBook} style={{ marginRight: 10 }}>
          Записаться
        </button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </>
  );
};

export default DoctorModal;
