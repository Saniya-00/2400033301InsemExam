import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  const events = [
    { date: "2025-10-15", title: "Meeting", description: "Team meeting at 10 AM" },
    { date: "2025-10-18", title: "Hackathon", description: "Coding challenge day" },
    { date: "2025-10-20", title: "Presentation", description: "Project review" },
  ];

  const currentMonthDates = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    const dateString = `2025-10-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateString);
  };

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  return (
    <div className="calendar">
      <h1>Interactive Calendar - October 2025</h1>
      <div className="grid">
        {currentMonthDates.map((day) => {
          const dateString = `2025-10-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateString;
          return (
            <div
              key={day}
              className={`day ${isSelected ? "selected" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="events">
        {selectedDate ? (
          selectedEvents.length > 0 ? (
            selectedEvents.map((event, i) => (
              <div key={i} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>No events for {selectedDate}</p>
          )
        ) : (
          <p>Select a date to view events</p>
        )}
      </div>
    </div>
  );
}

export default App;
