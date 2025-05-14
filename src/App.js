import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://csharp-timeapi.onrender.com/api/time';

const App = () => {
  const [localTime, setLocalTime] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [timezones, setTimezones] = useState([]);
  const selectedTzRef = useRef('');

  useEffect(() => {
    fetchTimezones();
    fetchLocalTime();

    // Fetch time every second
    const interval = setInterval(() => {
      fetchLocalTime();
      if (selectedTzRef.current) {
        fetchSelectedTime(selectedTzRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchTimezones = async () => {
    try {
      const response = await axios.get(`${API_BASE}/all-timezones`);
      setTimezones(response.data);
      if (response.data.length > 0) {
        const defaultTz = response.data[0];
        setSelectedTimezone(defaultTz);
        selectedTzRef.current = defaultTz;
        fetchSelectedTime(defaultTz);
      }
    } catch (err) {
      console.error('Error fetching timezones:', err);
    }
  };

  const fetchLocalTime = async () => {
    try {
      const response = await axios.get(`${API_BASE}/local`);
      setLocalTime(`${response.data.time} (${response.data.timezone})`);
    } catch (err) {
      console.error('Error fetching local time:', err);
    }
  };

  const fetchSelectedTime = async (tz) => {
    try {
      const response = await axios.get(`${API_BASE}/timezone`, {
        params: { tz }
      });
      setSelectedTime(`${response.data.time} (${response.data.timezone})`);
    } catch (err) {
      setSelectedTime('Invalid timezone selected');
    }
  };

  const handleTimezoneChange = (e) => {
    const newTz = e.target.value;
    setSelectedTimezone(newTz);
    selectedTzRef.current = newTz;
    fetchSelectedTime(newTz);
  };

  return (
    <>
      <div className="container">
        <h2>Local Time</h2>
        <div className="time-block">{localTime}</div>
      </div>

      <div className="container">
        <div className="time-block">
          <h2>Selected Timezone</h2>
          <select value={selectedTimezone} onChange={handleTimezoneChange}>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <div className="selected-time">{selectedTime}</div>
        </div>
      </div>
    </>
  );
};

export default App;
