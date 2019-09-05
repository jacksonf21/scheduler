import React, { useState, useEffect } from "react";

import "components/Application.scss";
import Appointment from "components/Appointment";
import DayList from "components/DayList";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

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
    })
  },[]);

  function bookInterview(id, interview) {
    const appointmentLoader = {
      ...state.appointment[id],
      interview: { ...interview }
    };
    
    const appointment = {
      ...state.appointment,
      [id]: appointmentLoader
    };
    
    setState({...state, appointment});
    console.log(interview);

    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
    .then(res => {
      console.log(res);
    })
  }

  function cancelInterview(id, interview) {
    const appointmentLoader = {
      ...state.appointment[id],
      interview: { ...interview }
    };
    
    const appointment = {
      ...state.appointment,
      [id]: appointmentLoader
    };
    
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => setState({...state, appointment}))
  }

  const schedules = getAppointmentsForDay(state, state.day).map((appointment, index) => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);
    // console.log(interview);
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
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
