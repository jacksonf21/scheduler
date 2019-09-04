import React, { useState, useEffect } from "react";

import "components/Application.scss";
import Appointment from "components/Appointment";
import DayList from "components/DayList";
import axios from "axios";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointment: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ]).then(values => {
      setState(prev => ({days: values[0].data, appointment: values[1].data, interviewers: values[2].data}))
      console.log(values[2]);
    })
  },[]);

  const schedules = getAppointmentsForDay(state, state.day).map((appointment, index) => {
    const interview = getInterview(state, appointment.interview)
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        // {...appointment}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        
          <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
          />  
        
        <hr className="sidebar__separator sidebar--centered"/>
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedules}
        <Appointment key="last" time="5pm"/>
      </section>
    </main>
  );
}
